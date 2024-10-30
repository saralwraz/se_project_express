import globals from "globals";
import airbnbBase from "eslint-config-airbnb-base";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.es2021,
        ...globals.node,
      },
    },
    extends: ["eslint:recommended", "eslint-config-airbnb-base"],
    plugins: ["prettier"],
    rules: {
      "no-console": "off",
      "no-underscore-dangle": ["error", { allow: ["_id"] }],
    },
  },
];
