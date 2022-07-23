module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    // "airbnb-base",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
  ],
  rules: {
    // "import/no-extraneous-dependencies": [
    //   "error",
    //   { devDependencies: ["**/*.test.js", "**/*.spec.js", "vite.config.js"] },
    // ],
    quotes: ["error", "double", { avoidEscape: true }],
    // "import/extensions": ["off"],
  },
  overrides: [
    {
      files: ".eslintrc.cjs",
      env: {
        node: true,
      }
    }
  ]
};
