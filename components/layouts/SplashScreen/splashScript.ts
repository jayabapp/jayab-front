const splashScript = `
(function () {
  var el = document.getElementById("app-splash");
  if (!el) return;

  var EXIT_DURATION = 500;
  var INTRO_DURATION = 700;
  var SESSION_MAX = 1500;
  var SAFETY = 5000;

  var shownAt = (performance && performance.now) ? performance.now() : 0;
  var now = function () { return ((performance && performance.now) ? performance.now() : 0) - shownAt; };

  var painted = false;
  var sessionReady = !/(^|;\\s*)isLogin=/.test(document.cookie || "");
  var finished = false;
  var observer = null;
  var poll = 0;
  var safety = 0;

  window.__appSplashReady = function () { sessionReady = true; check(); };

  function finish() {
    if (finished) return;
    finished = true;
    if (observer) { try { observer.disconnect(); } catch (e) {} }
    clearInterval(poll);
    clearTimeout(safety);
    delete window.__appSplashReady;

    el.classList.add("app-splash--leaving");
    setTimeout(function () { el.classList.add("app-splash--done"); }, EXIT_DURATION);
  }

  function check() {
    if (finished) return;
    if (!painted) return;
    if (now() < INTRO_DURATION) return;
    if (!sessionReady && now() < SESSION_MAX) return;
    finish();
  }

  try {
    if (window.PerformanceObserver && PerformanceObserver.supportedEntryTypes &&
        PerformanceObserver.supportedEntryTypes.indexOf("largest-contentful-paint") !== -1) {
      observer = new PerformanceObserver(function (list) {
        var entries = list.getEntries();
        for (var i = 0; i < entries.length; i++) {
          var node = entries[i].element;
          if (!node || !el.contains(node)) { painted = true; break; }
        }
        check();
      });
      observer.observe({ type: "largest-contentful-paint", buffered: true });
    } else {
      // Safari/Firefox report no LCP entries; settle for a committed frame instead.
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { painted = true; check(); });
      });
    }
  } catch (e) {
    painted = true;
  }

  poll = setInterval(check, 100);
  safety = setTimeout(finish, SAFETY);
})();
`;

export default splashScript;
