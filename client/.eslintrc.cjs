module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "standard",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "@emotion",
  ],
  rules: {
    quotes: ["error", "double", { avoidEscape: true }],
    semi: ["error", "always"],
    "no-use-before-define": "off",
    "no-trailing-spaces": ["error"],
    "@typescript-eslint/no-use-before-define": ["error"],
    "comma-dangle": ["error", "always-multiline"],
    "@typescript-eslint/no-explicit-any": ["off"],
    "@typescript-eslint/explicit-module-boundary-types": ["off"],
    "@typescript-eslint/no-unused-vars": ["error", { args: "none", ignoreRestSiblings: true }],
    "react/prop-types": ["off"],
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-namespace": ["warn", { allowDeclarations: true }],
    "@typescript-eslint/member-delimiter-style": ["error", {
      multiline: {
        delimiter: "comma",
        requireLast: true,
      },
      singleline: {
        delimiter: "comma",
        requireLast: false,
      },
      overrides: {
        interface: {
          multiline: {
            delimiter: "semi",
            requireLast: true,
          },
          singleline: {
            delimiter: "semi",
            requireLast: true,
          },
        },
      },
    }],
  },
  overrides: [
    {
      files: ".eslintrc.cjs",
      env: {
        node: true,
      },
    },
  ],
  globals: {
    // Hooks: "readonly",
    CONFIG: "readonly",
    Actor: "readonly",
    ActorSheet: "readonly",
    Actors: "readonly",
    jQuery: "readonly",
    JQuery: "readonly",
    mergeObject: "readonly",
    Item: "readonly",
  },

};
