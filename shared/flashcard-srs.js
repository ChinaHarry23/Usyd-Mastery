/**
 * SM-2 inspired scheduling for flashcards (intervals in ms).
 * Quality maps: 0=Again, 1=Hard, 2=Good, 3=Easy → internal 0-5 scale for EF.
 */
(function (global) {
  "use strict";

  var MIN_EF = 1.3;
  var MS_DAY = 86400000;
  var MS_10MIN = 600000;

  function mapQuality(q) {
    if (q === 0) return 0;
    if (q === 1) return 3;
    if (q === 2) return 4;
    if (q === 3) return 5;
    return 4;
  }

  function nextEase(ef, q05) {
    var nf = ef + (0.1 - (5 - q05) * (0.08 + (5 - q05) * 0.02));
    return Math.max(MIN_EF, nf);
  }

  /**
   * @param {object} card - { ef, reps, intervalDays, nextDue }
   * @param {number} quality - 0 Again, 1 Hard, 2 Good, 3 Easy
   * @returns {object} updated card fields
   */
  function schedule(card, quality) {
    var ef = typeof card.ef === "number" ? card.ef : 2.5;
    var reps = card.reps | 0;
    var now = Date.now();
    var out = { ef: ef, reps: reps, intervalDays: card.intervalDays || 0, nextDue: card.nextDue };

    if (quality === 0) {
      out.reps = 0;
      out.intervalDays = 0;
      out.ef = Math.max(MIN_EF, ef - 0.2);
      out.nextDue = now + MS_10MIN;
      return out;
    }

    var q5 = mapQuality(quality);
    ef = nextEase(ef, q5);
    reps += 1;

    var days;
    if (reps === 1) {
      days = quality === 1 ? 0.5 : quality === 2 ? 1 : 2;
    } else if (reps === 2) {
      days = quality === 1 ? 2 : quality === 2 ? 6 : 10;
    } else {
      var prev = card.intervalDays > 0 ? card.intervalDays : 1;
      var mult = quality === 1 ? 1.2 : quality === 2 ? ef : ef * 1.3;
      days = Math.max(1, Math.round(prev * mult));
    }

    out.reps = reps;
    out.ef = ef;
    out.intervalDays = days;
    out.nextDue = now + days * MS_DAY;
    return out;
  }

  function isDue(card, now) {
    now = now || Date.now();
    if (!card || card.nextDue == null) return true;
    return card.nextDue <= now;
  }

  global.FlashcardSRS = {
    schedule: schedule,
    isDue: isDue,
    MS_DAY: MS_DAY
  };
})(typeof window !== "undefined" ? window : this);
