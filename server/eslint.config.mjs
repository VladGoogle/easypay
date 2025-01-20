import typescriptEslintEslintPlugin from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/.eslintrc.js"],
}, ...compat.extends("plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"), {
    plugins: {
        "@typescript-eslint": typescriptEslintEslintPlugin,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.jest,
        },

        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "module",

        parserOptions: {
            project: "tsconfig.json",
            tsconfigRootDir: "/home/vlad/Documents/easy-pay/server",
        },
    },

    rules: {
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "warn",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "consistent-return": "warn",
        curly: "warn",
        eqeqeq: "warn",
        "no-constant-binary-expression": "warn",
        "no-duplicate-imports": "warn",
        "no-eq-null": "warn",
        "no-eval": "warn",
        "no-extend-native": "warn",
        "no-extra-bind": "warn",
        "no-implicit-coercion": "warn",
        "no-labels": "warn",
        "no-new-native-nonconstructor": "warn",
        "no-new-wrappers": "warn",

        "no-param-reassign": ["warn", {
            props: false,
        }],

        "no-self-compare": "warn",
        "no-throw-literal": "warn",
        "no-unmodified-loop-condition": "warn",
        "no-unneeded-ternary": "warn",
        "no-unreachable-loop": "warn",
        "no-use-before-define": "warn",
        "no-useless-concat": "warn",
        "no-useless-return": "warn",
        "no-var": "warn",
        "no-void": "warn",
        "object-shorthand": "warn",
        "prefer-const": "warn",
        "prefer-object-spread": "warn",
        "prefer-template": "warn",
        radix: "warn",
        "require-atomic-updates": "warn",
        "require-await": "warn",
        "spaced-comment": "warn",
        "symbol-description": "warn",
    },
}];