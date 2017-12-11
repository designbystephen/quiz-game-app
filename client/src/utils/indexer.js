/*
  Allows for directory based imports using default exports from each individual file found.
  Note: Webpack build must be modifier to ignore index.js
*/

const req = require.context('.', true, /\.jsx$/);

req.keys().forEach((key) => {
  const componentName = key.replace(/^.+\/([^/]+)\.jsx/, '$1');
  module.exports[componentName] = req(key).default;
});

