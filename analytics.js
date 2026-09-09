(function () {
  "use strict";

  const measurementId = "G-6MGZ1D35WV";
  const consentKey = "mrp_analytics_consent";

  function loadAnalytics() {
    if (window.mrpAnalyticsLoaded) return;
    window.mrpAnalyticsLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });

    const tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
    document.head.appendChild(tag);

    document.addEventListener("click", function (event) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest("a[href*='apps.apple.com']");
      if (!link) return;

      window.gtag("event", "app_store_click", {
        link_url: link.href,
        link_text: link.textContent.trim(),
        transport_type: "beacon"
      });
    });
  }

  function saveChoice(choice) {
    try {
      localStorage.setItem(consentKey, choice);
    } catch (_) {
      // The choice will apply for this page view if storage is unavailable.
    }
  }

  function showConsentNotice() {
    const notice = document.createElement("aside");
    notice.setAttribute("aria-label", "Website analytics choice");
    notice.style.cssText = [
      "position:fixed",
      "left:16px",
      "right:16px",
      "bottom:16px",
      "z-index:9999",
      "max-width:720px",
      "margin:0 auto",
      "padding:16px",
      "border:1px solid #d8d8df",
      "border-radius:12px",
      "background:#ffffff",
      "color:#16161a",
      "box-shadow:0 8px 30px rgba(0,0,0,.16)",
      "font:15px/1.45 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"
    ].join(";");

    notice.innerHTML =
      "<div style='margin-bottom:12px'>" +
      "This website can use Google Analytics to measure visits and App Store clicks. " +
      "It stays off unless you allow it. <a href='privacy.html' style='color:#2b6cf6'>Website privacy</a>." +
      "</div>" +
      "<div style='display:flex;gap:10px;flex-wrap:wrap'>" +
      "<button type='button' data-choice='allow' style='border:0;border-radius:8px;padding:9px 14px;background:#2b6cf6;color:#fff;font-weight:600;cursor:pointer'>Allow analytics</button>" +
      "<button type='button' data-choice='decline' style='border:1px solid #c8c8d0;border-radius:8px;padding:9px 14px;background:#fff;color:#16161a;font-weight:600;cursor:pointer'>No thanks</button>" +
      "</div>";

    notice.addEventListener("click", function (event) {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest("button[data-choice]");
      if (!button) return;

      const choice = button.getAttribute("data-choice");
      saveChoice(choice);
      notice.remove();
      if (choice === "allow") loadAnalytics();
    });

    document.body.appendChild(notice);
  }

  function start() {
    let choice = null;
    try {
      choice = localStorage.getItem(consentKey);
    } catch (_) {
      // Show the choice when storage cannot be read.
    }

    if (choice === "allow") {
      loadAnalytics();
    } else if (choice !== "decline") {
      showConsentNotice();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
