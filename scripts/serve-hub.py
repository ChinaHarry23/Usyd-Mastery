#!/usr/bin/env python3
"""Serve the study hub and start MTPLX when Page Chat asks for it.

The hub listens on 127.0.0.1:8080 so MTPLX can keep the port in its settings
(127.0.0.1:8000). Chat requests go to /__local/mtplx/..., which this process
forwards to the MTPLX OpenAI API. POST /__local/mtplx/ensure launches MTPLX.app
and waits until /health answers.
"""

from __future__ import annotations

import json
import os
import re
import subprocess
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
SETTINGS_PATH = Path.home() / "Library/Application Support/MTPLX/settings.json"
APP_PATH = Path("/Applications/MTPLX.app")
RUNTIME = Path.home() / "Library/Application Support/MTPLX/runtime-venv/bin/mtplx"
HUB_HOST = "127.0.0.1"
HUB_PORT = 8080
HEALTH_TIMEOUT_S = 240
ENSURE_LOCK = threading.Lock()


def load_settings() -> dict:
    try:
        return json.loads(SETTINGS_PATH.read_text())
    except (OSError, json.JSONDecodeError):
        return {}


def api_host_port() -> tuple[str, int]:
    settings = load_settings()
    host = str(settings.get("host") or "127.0.0.1")
    if host in {"0.0.0.0", "::"}:
        host = "127.0.0.1"
    try:
        port = int(settings.get("port") or 8000)
    except (TypeError, ValueError):
        port = 8000
    return host, port


def health_ok(timeout: float = 1.5) -> bool:
    host, port = api_host_port()
    try:
        with urlopen(f"http://{host}:{port}/health", timeout=timeout) as response:
            return 200 <= response.status < 300
    except (OSError, HTTPError, URLError, TimeoutError):
        return False


def process_running(name: str) -> bool:
    return subprocess.run(["pgrep", "-x", name], capture_output=True).returncode == 0


def serve_process_running() -> bool:
    result = subprocess.run(["pgrep", "-fl", "mtplx serve"], capture_output=True, text=True)
    return result.returncode == 0 and "mtplx serve" in result.stdout


def set_launch_on_open(enabled: bool) -> None:
    if not SETTINGS_PATH.exists():
        return
    text = SETTINGS_PATH.read_text()
    updated, count = re.subn(
        r'("launch_daemon_on_open"\s*:\s*)(true|false)',
        r"\g<1>" + ("true" if enabled else "false"),
        text,
        count=1,
    )
    if count:
        SETTINGS_PATH.write_text(updated)


def launch_on_open_enabled() -> bool:
    return bool(load_settings().get("launch_daemon_on_open"))


def quit_app() -> None:
    subprocess.run(["osascript", "-e", 'tell application "MTPLX" to quit'], check=False)
    for _ in range(40):
        if not process_running("MTPLXApp"):
            return
        time.sleep(0.25)
    subprocess.run(["killall", "MTPLXApp"], check=False)
    time.sleep(0.5)


def open_app() -> None:
    if not APP_PATH.exists():
        raise RuntimeError(f"MTPLX.app was not found at {APP_PATH}")
    subprocess.run(
        ["launchctl", "setenv", "MTPLX_CORS_ORIGINS", "https://chinaharry23.github.io"],
        check=False,
    )
    subprocess.run(["open", "-a", str(APP_PATH)], check=True)


def start_runtime_directly() -> None:
    """Start the same runtime binary the app uses when the app did not spawn it."""
    if not RUNTIME.exists():
        raise RuntimeError(f"MTPLX runtime was not found at {RUNTIME}")
    settings = load_settings()
    host, port = api_host_port()
    model = settings.get("model")
    if not model:
        raise RuntimeError("MTPLX settings.json has no model to serve")
    command = [
        str(RUNTIME),
        "serve",
        "--host",
        host,
        "--port",
        str(port),
        "--model",
        str(model),
        "--yes",
        "--no-stats-footer",
        "--cors-origin",
        "https://chinaharry23.github.io",
    ]
    profile = settings.get("profile")
    if profile:
        command.extend(["--profile", str(profile)])
    fan_mode = settings.get("fan_mode")
    if fan_mode:
        command.extend(["--fan-mode", str(fan_mode)])
    log_path = Path.home() / ".mtplx/logs/study-hub-serve.log"
    log_path.parent.mkdir(parents=True, exist_ok=True)
    log_file = open(log_path, "ab")
    subprocess.Popen(
        command,
        stdout=log_file,
        stderr=subprocess.STDOUT,
        stdin=subprocess.DEVNULL,
        start_new_session=True,
    )


def ensure_mtplx() -> dict:
    host, port = api_host_port()
    endpoint = f"http://{host}:{port}/v1/chat/completions"
    if health_ok():
        return {"ok": True, "started": False, "endpoint": endpoint}

    original = launch_on_open_enabled()
    restore_started = False

    def restore_flag() -> None:
        time.sleep(12)
        set_launch_on_open(original)

    try:
        if not serve_process_running():
            # Quit first. The app writes settings.json as it exits, and that
            # would undo a launch flag set before the quit.
            if process_running("MTPLXApp"):
                quit_app()
            set_launch_on_open(True)
            open_app()
            threading.Thread(target=restore_flag, daemon=True).start()
            restore_started = True

            spawn_deadline = time.time() + 20
            while time.time() < spawn_deadline:
                if health_ok() or serve_process_running():
                    break
                time.sleep(0.4)
            else:
                start_runtime_directly()

        deadline = time.time() + HEALTH_TIMEOUT_S
        while time.time() < deadline:
            if health_ok(timeout=2):
                return {"ok": True, "started": True, "endpoint": endpoint}
            time.sleep(1)
        raise RuntimeError(
            f"MTPLX did not answer http://{host}:{port}/health within {HEALTH_TIMEOUT_S}s"
        )
    finally:
        if not restore_started:
            set_launch_on_open(original)


class HubHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        if self._local_path().startswith("/__local/mtplx/"):
            self._proxy()
            return
        super().do_GET()

    def do_POST(self):
        path = self._local_path()
        if path == "/__local/mtplx/ensure":
            self._ensure()
            return
        if path.startswith("/__local/mtplx/"):
            self._proxy()
            return
        self.send_error(404)

    def do_OPTIONS(self):
        if self._local_path().startswith("/__local/mtplx/"):
            self.send_response(204)
            self.send_header("Access-Control-Allow-Origin", self.headers.get("Origin") or "*")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", self.headers.get("Access-Control-Request-Headers") or "*")
            self.end_headers()
            return
        self.send_error(404)

    def _local_path(self) -> str:
        return self.path.split("?", 1)[0]

    def _ensure(self) -> None:
        length = int(self.headers.get("Content-Length") or 0)
        if length:
            self.rfile.read(length)
        try:
            with ENSURE_LOCK:
                payload = ensure_mtplx()
            status = 200
        except Exception as exc:
            payload = {"ok": False, "error": str(exc)}
            status = 503
        body = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _proxy(self) -> None:
        upstream_path = self.path[len("/__local/mtplx") :] or "/"
        route = upstream_path.split("?", 1)[0]
        if route != "/health" and not route.startswith("/v1/"):
            self.send_error(404)
            return
        host, port = api_host_port()
        length = int(self.headers.get("Content-Length") or 0)
        body = self.rfile.read(length) if length else None
        headers = {}
        if self.headers.get("Content-Type"):
            headers["Content-Type"] = self.headers["Content-Type"]
        if self.headers.get("Authorization"):
            headers["Authorization"] = self.headers["Authorization"]
        request = Request(f"http://{host}:{port}{upstream_path}", data=body, headers=headers, method=self.command)
        try:
            upstream = urlopen(request, timeout=HEALTH_TIMEOUT_S)
        except HTTPError as exc:
            upstream = exc
        except (OSError, URLError, TimeoutError) as exc:
            message = json.dumps({"error": {"message": f"MTPLX is not reachable: {exc}"}}).encode()
            self.send_response(503)
            self.send_header("Content-Type", "application/json")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(message)))
            self.end_headers()
            self.wfile.write(message)
            return

        self.send_response(upstream.status)
        content_type = upstream.headers.get("Content-Type") or "application/json"
        self.send_header("Content-Type", content_type)
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Accel-Buffering", "no")
        self.end_headers()
        try:
            while True:
                chunk = upstream.read(4096)
                if not chunk:
                    break
                self.wfile.write(chunk)
                self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
            pass
        finally:
            upstream.close()

    def log_message(self, fmt: str, *args) -> None:
        print("[hub]", self.address_string(), fmt % args)


def main() -> None:
    os.chdir(ROOT)
    server = ThreadingHTTPServer((HUB_HOST, HUB_PORT), HubHandler)
    host, port = api_host_port()
    print(f"Study hub: http://{HUB_HOST}:{HUB_PORT}/")
    print(f"MTPLX API: http://{host}:{port}/v1  (started when Page Chat sends)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
