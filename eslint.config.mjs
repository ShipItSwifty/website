// ESLint 10 flat config.
// We replaced `eslint-config-next` because its transitive plugins
// (eslint-plugin-react, jsx-a11y, import) don't yet support ESLint 10.
// Instead we compose: typescript-eslint + react-hooks + @next/next directly.
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";
import globals from "globals";

export default tseslint.config(
  // Ignored paths
  {
    ignores: [".next/**", "node_modules/**", "public/**", "data/**", "out/**", "next-env.d.ts"],
  },

  // Base JS recommended (all files)
  js.configs.recommended,

  // TypeScript recommended (TS files only)
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    extends: [...tseslint.configs.recommended],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Defer to TS-aware version
      "no-unused-vars": "off",
    },
  },

  // React Hooks rules for React files
  {
    files: ["**/*.{ts,tsx,jsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // The new `set-state-in-effect` rule (react-hooks v7) flags legitimate
      // post-mount-once patterns (mounted flags, platform sniffing,
      // animation kickoff). Downgrade to warning; we vet these manually.
      "react-hooks/set-state-in-effect": "warn",
    },
  },

  // Next.js rules
  {
    files: ["**/*.{ts,tsx,js,jsx,mts,cts}"],
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },

  // Globals for app code (browser + node)
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs,mts,cts}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly",
      },
    },
  },

  // Node-style scripts
  {
    files: ["scripts/**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      "no-console": "off",
    },
  },
);
