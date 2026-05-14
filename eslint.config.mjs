import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";
import checkFile from "eslint-plugin-check-file";
import unusedImports from "eslint-plugin-unused-imports";

/**
 * Cho phép literal số “tần suất cao” trong UI / layout / HTTP / animation
 * để tránh nhiễu no-magic-numbers trên code không mang nghiệp vụ (spacing 4–32, mã HTTP…).
 * Logic nghiệp vụ (giá BP, công thức game, hạn mức tài chính) vẫn nên đặt tên hằng trong file/domain tương ứng.
 */
const MAGIC_NUMBER_IGNORE = [
  0, 1, -1, -4,
  ...Array.from({ length: 99 }, (_, i) => i + 2),
  120, 128, 200, 255, 256, 400, 401, 403, 404, 500, 502, 503, 504, 600, 768, 800, 1000, 2000, 10000, 1000000,
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      boundaries,
      "check-file": checkFile,
      "unused-imports": unusedImports,
    },
    settings: {
      "boundaries/elements": [
        {
          "type": "component",
          "pattern": "src/components/*"
        },
        {
          "type": "service",
          "pattern": "src/services/*"
        },
        {
          "type": "app",
          "pattern": "src/app/*"
        }
      ]
    },
    rules: {
      // 1. Unused Imports
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" },
      ],
      "@typescript-eslint/no-unused-vars": [
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

      // 3. Magic numbers: allowlist + tắt trên shadcn/ui & file constants tập trung
      "no-magic-numbers": [
        "warn",
        { ignore: MAGIC_NUMBER_IGNORE, ignoreArrayIndexes: true },
      ],

      // 4. No Any
      "@typescript-eslint/no-explicit-any": "error",

      // 5. Boundaries (Disabled for now)
      /*
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
      */
    },
  },
  {
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "no-magic-numbers": "off",
    },
  },
  {
    files: ["src/constants/**/*.{ts,tsx}"],
    rules: {
      "no-magic-numbers": "off",
    },
  },
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    ignores: ["src/app/**"],
    rules: {
      "check-file/folder-naming-convention": [
        "error",
        {
          "src/**": "KEBAB_CASE",
        },
      ],
    },
  },
  {
    files: ["src/app/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "check-file/folder-naming-convention": [
        "error",
        {
          "src/app/**/": "NEXT_JS_APP_ROUTER_CASE",
        },
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
