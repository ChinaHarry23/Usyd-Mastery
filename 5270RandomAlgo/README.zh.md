<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/English-切换语言-555?style=for-the-badge" alt="Switch to English"></a>
  &nbsp;
  <a href="README.zh.md"><img src="https://img.shields.io/badge/中文-当前-6c8cff?style=for-the-badge" alt="中文（当前）"></a>
</p>

> **说明：** GitHub 的 README 无法运行 JavaScript，不能在同一页里做真正的交互按钮。上方徽章分别链到英文版与中文版文档，点一下即可切换语言。

---

# COMPX270 学习站点

本仓库为 **COMPX270 — 随机与高级算法**（与**悉尼大学**课程材料对应，2026 年第一学期）的交互式学习资料：分章导读、交互演示、数学基础、思维导图、测验与双语（English / 中文）界面。

本站为**纯静态站点**（HTML、CSS、JavaScript），无需构建、无服务端逻辑，均在浏览器中运行。

---

## 内容概览

| 模块 | 说明 |
|------|------|
| **首页** (`index.html`) | 进入各章与全局工具入口。 |
| **学习导读** (`chapters/chapterN/web/chapterN-study.html`) | 正文、交互演示、教程题与可展开解答。 |
| **数学基础** (`chapters/chapterN/web/chapterN-math.html`) | 随堂快速检查（计入进度）。 |
| **思维导图** (`chapters/chapterN/web/chapterN-mindmap.html`) | 章节概念图。 |
| **知识图谱** | `tools/knowledge-graph.html`（概念）、`tools/math-knowledge-graph.html`（数学主题）。 |
| **测验中心** (`tools/quiz-hub.html`) | 分章练习 / 测验模式。 |
| **闪卡** (`tools/flashcards.html`) | 基于学习导读的间隔重复（数据见 `data/flashcard-data.js`）。 |
| **进度看板** (`tools/progress-dashboard.html`) | 加权进度：章节阅读、快速检查、测验最高分、教程题自评。 |

各章讲义、幻灯片、教程等 PDF 位于对应 `chapters/chapterN/materials/` 目录。

---

## 使用说明

1. **从首页开始** — 用浏览器打开 `index.html`，选择章节或工具（知识图谱、测验中心、进度等）。
2. **每章三类页面** — **学习导读**为主线和演示；**数学基础**为短练习；**思维导图**为提纲。请跟随页内导航与侧栏。
3. **语言** — 在支持的页面使用 **EN / 中文** 切换；偏好保存在浏览器 `localStorage`。
4. **教程题** — 先独立思考，再点 **查看解答 / Show Solution**；展开后可自评是否理解并与结论一致，该结果计入进度的**教程题**部分。
5. **测验** — 在 **测验中心** 选择范围与模式；各章测验**最高分**参与进度计算。
6. **进度看板** — **进度**页可查看分章明细与总体加权完成度。数据**仅存在本机浏览器**，换设备或浏览器不会自动同步。
7. **公式渲染** — 页面可能从 CDN 加载 KaTeX/MathJax；离线使用需自行托管静态资源。

---

## 局域网本地访问（如 iPad）

在电脑上于**项目根目录**（含 `index.html` 的文件夹）启动 HTTP 服务，并绑定 **`0.0.0.0`**，同一局域网内的手机、iPad 即可访问。若端口被占用，请改用其他端口。

### 方案 A：Python 3

*（多数 Mac/Linux 自带 Python 3。）*

```bash
cd /path/to/Study && python3 -m http.server 8000 --bind 0.0.0.0
```

### 方案 B：Node.js

*（使用 `npx`，首次运行可能下载依赖。）*

```bash
cd /path/to/Study && npx --yes http-server -p 8000 -a 0.0.0.0
```

### 在 iPad / 手机上

1. 查看电脑的**局域网 IP**（例如 macOS：**系统设置 → 网络 → Wi‑Fi → 详细信息** 中的 IP，常见为 `192.168.x.x`）。
2. 在 Safari 或其他浏览器中访问：`http://你的局域网IP:8000/` — 例如 `http://192.168.1.42:8000/`

**提示**

- 学习时保持电脑不休眠；用完后在终端按 `Ctrl+C` 结束服务。
- 若无法打开，检查电脑**防火墙**，并确认设备在同一 **Wi‑Fi**（访客网络常会隔离设备）。
- 公网或 HTTPS 需 ngrok 等隧道；仅家庭局域网则不必。

---

## 目录结构（简）

```
Study/
├── index.html
├── tools/                  # 全站工具（图谱、测验、闪卡、进度）
│   ├── knowledge-graph.html
│   ├── math-knowledge-graph.html
│   ├── quiz-hub.html
│   ├── flashcards.html
│   └── progress-dashboard.html
├── data/                   # 工具用数据
│   ├── flashcard-data.js
│   └── quiz-data-extract.js
├── shared/                 # 共用 CSS、JS（语言、进度、思维导图等）
└── chapters/               # 全部章节（1–12）
    └── chapterN/
        ├── materials/      # PDF 讲义与资料
        └── web/            # 各章 HTML + JS
```

---

## 来源与致谢

**讲义、幻灯片与教程**的结构与内容与 **Clément Canonne** 在**悉尼大学**开设的 *Randomised and Advanced Algorithms* 公开课程材料一致（作者在页面上对应 COMP4270 / COMP5270；章节目录与链接见 [**ccanonne.github.io/teaching/COMPx270.html**](https://ccanonne.github.io/teaching/COMPx270.html)）。作者将 LaTeX 源码等以 **CC BY-NC-ND 4.0** 发布，请以该页面为准获取许可与原始文件。

本网站项目在此基础上增加了交互页面、测验、进度与双语界面；**并非**悉尼大学官方出版物。

---

## 版权与课程材料

课程 PDF 与教学内容版权归原作者、**悉尼大学**（如适用）及原始许可下的权利人所有（参见[**课程主页**](https://ccanonne.github.io/teaching/COMPx270.html)）。本仓库仅供个人学习整理与浏览；请遵守版权、讲义所附 **CC BY-NC-ND** 条款及本校关于传播的规定。

---

## 贡献说明

本项目为个人学习用途。若 Fork 使用，请自行修改路径与课程标识以适配你的课程。
