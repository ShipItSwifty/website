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
    api: "https://shipitswifty.github.io/shipitswifty/documentation/shipitkit/",
  },
  social: {
    // Add Twitter/Mastodon/Bluesky here once they exist.
  },
  install: {
    // Flip this once the public tap exists.
    homebrewAvailable: false as boolean,
    homebrewCommand: "brew tap shipitswifty/tap\nbrew install shipit",
  },
} as const;

export type SiteConfig = typeof siteConfig;
