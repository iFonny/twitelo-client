module.exports = {
  plugins: ['prettier'],
  rules: {
    'no-console': 0,
    'prettier/prettier': 'error',
    'react/forbid-prop-types': 0,
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
  },
  extends: ['airbnb', 'prettier', 'prettier/react'],
};
