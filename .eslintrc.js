module.exports = {
  plugins: ['prettier'],
  rules: {
    'no-console': 0,
    'prettier/prettier': 'error',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
  },
  extends: ['airbnb', 'prettier'],
};
