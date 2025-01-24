import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    ignores: ["node_modules", "dist"], // Ignore specific directories
    rules: {
      // Example JavaScript rules
      "no-unused-vars": "error", // Warn about unused variables
      "no-console": "off", // Allow console logs
      eqeqeq: "error", // Enforce strict equality checks
      "prefer-const": "error",
      "no-undef": "warning",
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
