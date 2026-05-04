import js from "@eslint/js";
import globals from "globals";
import solid from "eslint-plugin-solid/configs/typescript";
import * as tsParser from "@typescript-eslint/parser";

export default [
    js.configs.recommended,
    {
        ignores: ["dist/**", "node_modules/**"],
    },
    {
        files: ["**/*.{ts,tsx}"],
        ...solid,
        languageOptions: {
            globals: {
                ...globals.browser,
            },
            parser: tsParser,
            parserOptions: {
                project: "tsconfig.json",
            },
        },
    },
];
