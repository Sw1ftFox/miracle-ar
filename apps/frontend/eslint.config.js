import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";
import cssModules from "eslint-plugin-css-modules";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    settings: {
      "css-modules": {
        basePath: "./",
      },
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      import: importPlugin,
      react: reactPlugin,
      "css-modules": cssModules,
    },
    rules: {
      indent: ["error", 2],
      "react/jsx-indent": ["error", 2],
      "react/jsx-indent-props": ["error", 2],
      "import/prefer-default-export": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-filename-extension": [
        2,
        { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      ],
      "import/no-unresolved": "off",
      "import/extensions": "off",
      "no-unused-vars": "warn",
      "react/require-default-props": "off",
      "react/function-component-definition": "off",
      "react/jsx-props-no-spreading": "warn",
      "no-shadow": "off",
      "import/no-extraneous-dependencies": "warn",
      "no-underscore-dangle": "off",
      "max-len": ["error", { ignoreComments: true, code: 100 }],
      "css-modules/no-unused-class": "warn",
      "css-modules/no-undef-class": "error",
    },
  },
]);
