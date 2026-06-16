import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { ToastProvider } from "./components/common/Toast";
import { AnalyticsAPI } from "./utils/api";

// Global flag to prevent duplicate tracking requests within the same page load lifecycle (e.g., React.StrictMode in dev)
let isTrackedInSession = false;

function App() {
  useEffect(() => {
    // Only track once per browser session to prevent duplicate hits on page navigation/refresh
    if (isTrackedInSession || sessionStorage.getItem("website_visited")) {
      return;
    }
    isTrackedInSession = true;
    // Set immediately to prevent duplicate requests caused by concurrent renders
    sessionStorage.setItem("website_visited", "true");

    const trackTraffic = async () => {
      try {
        // 1. Check UTM parameter ?utm_source=... or ?source=...
        const params = new URLSearchParams(window.location.search);
        let source = params.get("utm_source") || params.get("source");

        // 2. If no UTM source in query, analyze document.referrer and navigator.userAgent
        if (!source) {
          const referrer = document.referrer.toLowerCase();
          const userAgent = navigator.userAgent.toLowerCase();

          // Check TikTok (via web referrer or internal TikTok in-app browser user agent)
          if (
            referrer.includes("tiktok.com") ||
            userAgent.includes("musical_ly") ||
            userAgent.includes("tiktok")
          ) {
            source = "tiktok";
          }
          // Check Facebook, Instagram, Messenger (via web referrers or in-app browser user agents: FBAN/FBAV)
          else if (
            referrer.includes("facebook.com") ||
            referrer.includes("fb.com") ||
            referrer.includes("instagram.com") ||
            referrer.includes("messenger.com") ||
            referrer.includes("t.co") || // Twitter/X redirect URL
            referrer.includes("twitter.com") ||
            userAgent.includes("fban") ||
            userAgent.includes("fbav") ||
            userAgent.includes("instagram") ||
            userAgent.includes("messenger")
          ) {
            source = "facebook";
          }
          // Check YouTube (via web referrer or internal YouTube app browser user agent)
          else if (
            referrer.includes("youtube.com") ||
            referrer.includes("youtu.be") ||
            userAgent.includes("youtube")
          ) {
            source = "youtube";
          }
          // Check organic search engine redirects
          else if (
            referrer.includes("google.") ||
            referrer.includes("bing.com") ||
            referrer.includes("yahoo.com") ||
            referrer.includes("duckduckgo.com")
          ) {
            source = "organic";
          } else if (referrer && !referrer.includes(window.location.hostname)) {
            source = "organic"; // Map other external sites to organic search/ref
          } else {
            source = "direct";
          }
        }

        // Send tracking request to backend API
        await AnalyticsAPI.trackVisit(source);
      } catch (err) {
        console.error("Failed to track traffic visitor:", err);
      }
    };

    trackTraffic();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <ToastProvider>
        <BrowserRouter basename={__BASE_PATH__}>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </I18nextProvider>
  );
}

export default App;
