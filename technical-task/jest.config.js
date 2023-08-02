const esbuildJest = require('esbuild-jest');

module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": esbuildJest,
  },
};
