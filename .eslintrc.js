module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-console": "off",
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    "padding-line-between-statements": [
      "error",
      { blankLine: "always", prev: "import", next: "*" },
    ],
  },
};
