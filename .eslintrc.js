module.exports = {
  plugins: ['prettier'],
  rules: {
    'no-console': 0,
    'prettier/prettier': 'error',
    'react/forbid-prop-types': 0,
    'jsx-a11y/interactive-supports-focus': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/label-has-associated-control': 0,
  },
  extends: ['airbnb', 'prettier', 'prettier/react'],
};
