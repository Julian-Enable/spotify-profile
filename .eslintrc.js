module.exports = {
  extends: ['react-app', 'react-app/jest'],
  rules: {
    'react-hooks/exhaustive-deps': 'warn', // Cambiar de 'error' a 'warn'
  },
  env: {
    browser: true,
    es2021: true,
  },
};
