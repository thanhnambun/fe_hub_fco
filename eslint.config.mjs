import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";
import checkFile from "eslint-plugin-check-file";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      boundaries,
      "check-file": checkFile,
      "unused-imports": unusedImports,
    },
    rules: {
      // 1. Unused Imports
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" },
      ],

      // 2. Kebab-case for file names
      "check-file/filename-naming-convention": [
        "error",
        {
          "**/*.{ts,tsx,js,jsx}": "KEBAB_CASE",
        },
        {
          "ignoreMiddleExtensions": true,
        },
      ],
      "check-file/folder-naming-convention": [
        "error",
        {
          "src/**": "KEBAB_CASE",
        },
      ],

      // 3. No Magic Numbers
      "no-magic-numbers": ["warn", { "ignore": [0, 1, -1], "ignoreArrayIndexes": true }],

      // 4. No Any
      "@typescript-eslint/no-explicit-any": "error",

      // 5. Boundaries (Example configuration)
      "boundaries/entry-point": [
        "error",
        {
          "default": "disallow",
          "rules": [
            {
              "target": "src/components/*",
              "allow": "index.ts"
            },
            {
              "target": "src/services/*",
              "allow": "index.ts"
            }
          ]
        }
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
