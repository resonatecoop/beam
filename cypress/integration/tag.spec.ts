/// <reference types="cypress" />

const API_V2 = "https://stream.resonate.coop/api/v2/";

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

    it("should be able to play a staff pick playlist", () => {
      cy.intercept("GET", API_V2 + "tag/*").as("getTag");
      cy.intercept("https://api.resonate.coop/v1/stream/*").as("getTrackAudio");

      cy.get("[data-cy=tag-list] li").first().click();
      cy.wait("@getTag");
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
