/// <reference types="cypress" />

describe("tag page", () => {
  describe("unauthenticated", () => {
    beforeEach(() => {
      // Cypress starts out with a blank slate for each test
      // so we must tell it to visit our website with the `cy.visit()` command.
      // Since we want to visit the same URL at the start of all our tests,
      // we include it in our beforeEach function so that it runs before each test
      cy.visit("/");
    });
    it("navigate to a tag page", () => {
      cy.get("[data-cy=tag-list] li").first().click();
    });

    it("should be play a song from a track list", () => {
      cy.intercept("GET", Cypress.env("API") + "tag/*").as("getTag");
      cy.intercept(Cypress.env("API") + "stream/*").as("getTrackAudio");

      cy.get("[data-cy=tag-list] li").first().click();
      cy.wait("@getTag").then(() => {});
      cy.get("ul li img")
        .first()
        .scrollIntoView()
        .trigger("hover", { force: true });

      cy.get("button").contains("Play").first().click();
      cy.wait(["@getTrackAudio"]).then(() => {
        cy.isPlayingAudio();
      });
    });
  });
});
