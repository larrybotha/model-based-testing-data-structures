const path = require("path");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  moduleNameMapper: {
    "^@testutils(.*)$": "<rootDir>/test/utils/$1",
  },
};
