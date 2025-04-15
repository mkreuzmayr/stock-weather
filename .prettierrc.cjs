'use strict';
/** @typedef  {import("prettier").Config} PrettierConfig*/
/** @typedef  {{ tailwindConfig: string }} TailwindConfig*/

/** @type { PrettierConfig | TailwindConfig } */
module.exports = {
  plugins: [
    'prettier-plugin-organize-imports',
    'prettier-plugin-tailwindcss',
    'prettier-plugin-packagejson',
  ],
  printWidth: 80,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  tabWidth: 2,
  arrowParens: 'always',
};
