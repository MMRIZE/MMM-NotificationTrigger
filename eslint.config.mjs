import { defineConfig } from "eslint/config"
import globals from "globals"
import js from "@eslint/js"
import markdown from "@eslint/markdown"
import stylistic from "@stylistic/eslint-plugin"

export default defineConfig([
	{
		files: ["**/*.js", "**/*.mjs"],
		languageOptions: {
			ecmaVersion: "latest",
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		plugins: { js, stylistic },
		extends: ["js/all", "stylistic/recommended"],
		rules: {
			"@stylistic/array-element-newline": ["error", "consistent"],
			"@stylistic/comma-dangle": ["error", "only-multiline"],
			"@stylistic/dot-location": ["error", "property"],
			"@stylistic/function-call-argument-newline": ["error", "consistent"],
			"@stylistic/indent": ["error", "tab"],
			"@stylistic/no-multi-spaces": ["error", { ignoreEOLComments: true }],
			"@stylistic/no-tabs": "off",
			"@stylistic/object-property-newline": ["error", { allowAllPropertiesOnSameLine: true }],
			"@stylistic/padded-blocks": ["error", "never"],
			"@stylistic/quote-props": ["error", "as-needed"],
			"@stylistic/quotes": ["error", "double", { avoidEscape: true }],
			"func-names": "off",
			"guard-for-in": "off",
			"id-length": "off",
			"max-depth": ["error", 5],
			"max-params": ["error", 6],
			"max-lines-per-function": ["error", { max: 55, skipBlankLines: true, skipComments: true }],
			"max-statements": ["error", 25],
			"no-magic-numbers": "off",
			"no-shadow": "off",
			"no-ternary": "off",
			"object-shorthand": "off",
			"one-var": ["error", "never"],
			"sort-keys": "off",
		},
	},
	{ files: ["**/*.md"], plugins: { markdown }, extends: ["markdown/recommended"], language: "markdown/gfm" },
])
