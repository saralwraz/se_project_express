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
    plugins: {
      airbnbBase,
    },
    rules: {
      // Add any specific rules you need to configure
    },
  },
];
