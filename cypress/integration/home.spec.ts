/// <reference types="cypress" />

describe("home page", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("");
  });

  it("navigate the home page", () => {
    cy.get("h2").should("contain", "co-operative");
    cy.get("h3").should("contain", "New releases");
    cy.get("h3").should("contain", "Staff picks");
  });
});
