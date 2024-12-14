/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-astro'],
  trailingComma: 'none',
  singleQuote: true,
  jsxSingleQuote: true,
  experimentalTernaries: true,
  overrides: [
    {
      files: ['*.css'],
      options: {
        singleQuote: false
      }
    },
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    }
  ]
};
