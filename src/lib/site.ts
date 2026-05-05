export const siteConfig = {
  name: "ShipItSwifty",
  url: "https://shipitswifty.tools",
  tagline: "Swift-native release automation for iOS and Android.",
  description:
    "ShipItSwifty is a Swift-native CLI for iOS and Android release automation. Build, archive, sign, and ship to TestFlight and the App Store from a single YAML config — no Ruby required.",
  github: {
    cli: "https://github.com/ShipItSwifty/shipitswifty",
    cliRepo: "ShipItSwifty/shipitswifty",
    website: "https://github.com/ShipItSwifty/website",
    websiteRepo: "ShipItSwifty/website",
  },
  docs: {
    api: "/docs/api/shipitkit",
  },
  social: {
    // Add Twitter/Mastodon/Bluesky here once they exist.
  },
  install: {
    // Flip this once the public tap exists.
    homebrewAvailable: true as boolean,
    homebrewCommand: "brew install shipitswifty/tap/shipit",
  },
} as const;

export type SiteConfig = typeof siteConfig;
