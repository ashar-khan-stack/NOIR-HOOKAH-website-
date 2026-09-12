/**
 * Centralized Application Configuration
 * All external URLs, brand information, and service configurations live here.
 */

export const APP_CONFIG = {
  brand: {
    name: "NOIR HOOKAH",
    shortName: "NOIR",
    tagline: "Elevate the Night.",
    subTagline: "An elevated hookah experience crafted for unforgettable nights.",
    currency: "Rs.",
    currencyCode: "PKR",
    establishedYear: "2024",
    address: "Block 4, Clifton, Executive Boulevard, Karachi, Pakistan",
    phone: "+92 21 3589 9000",
    email: "vip@noirhookah.com",
    openingHours: {
      weekdays: "6:00 PM – 3:00 AM",
      weekends: "6:00 PM – 4:30 AM",
    },
    socialLinks: {
      instagram: "https://instagram.com/noirhookah.official",
      facebook: "https://facebook.com/noirhookah.official",
      twitter: "https://twitter.com/noirhookah",
    },
  },
  
  // Mobile Application Config
  mobileApp: {
    androidAppUrl: process.env.VITE_ANDROID_APP_URL || "https://play.google.com/store/apps/details?id=com.noirhookah.app",
    iosAppUrl: process.env.VITE_IOS_APP_URL || "https://apps.apple.com/app/noir-hookah/id1689000000",
    deepLinkScheme: "noirhookah://",
    version: "2.4.0",
  },

  // Service Abstraction Endpoints (Configurable for future real backend integration)
  api: {
    baseUrl: process.env.VITE_API_BASE_URL || "/api/v1",
    timeoutMs: 10000,
  },

  // Feature Flags
  features: {
    enablePushNotifications: true,
    enablePWA: true,
    enableNewsletterPopup: true,
    enableLoyaltyProgram: true,
    enableGiftCardCheckout: true,
  },
};
