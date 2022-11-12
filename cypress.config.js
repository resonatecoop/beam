const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:8080",
    supportFile: "cypress/support/index.js",
  },
  env: {
    issuer: "http://localhost:4000",
    API: "http://localhost:4000/api/v3/",
  },
  chromeWebSecurity: false,
});
