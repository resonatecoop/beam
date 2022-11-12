/// <reference types="cypress" />

describe("artist page", () => {
  describe("unauthenticated", () => {
    beforeEach(() => {
      cy.log("Cypress", Cypress.env("API") + "artists/*");
      cy.intercept(Cypress.env("API") + "artists/*").as("getArtist");
      // NOTE: navigation via URL won't work within electron because
      // we use the MemoryRouter there.
      cy.memoryNavigate("/library/artist/49d2ac44-7f20-4a47-9cf5-3ea5d6ef78f6");
      cy.wait(["@getArtist"]).then(() => {});
    });

    it("should be play a song from a track list", () => {
      cy.intercept(Cypress.env("API") + "stream/*").as("getTrackAudio");
      cy.get("button.play-button").first().click();
      cy.wait(["@getTrackAudio"]).then(() => {
        cy.isPlayingAudio();
      });

      cy.get("[data-cy=track-row-pause-button]").first().click();
      cy.isAudioPaused();
    });

    it("should pop up track details", () => {
      cy.get("[aria-label='open track actions']").first().click();
      cy.get("[data-cy=modal]").contains("matrix");
      cy.get("[data-cy=modal]").contains("Share & embed");
      cy.get("[data-cy=modal]").contains("Artist page");
    });
  });

  describe("authenticated", () => {
    beforeEach(() => {
      cy.intercept(Cypress.env("API") + "artists/*").as("getArtist");
      cy.intercept(Cypress.env("API") + "user/plays/resolve", {
        body: { data: [{ count: 1, trackId: 1 }] },
      }).as("getPlayCounts");
      cy.intercept(Cypress.env("API") + "user/favorites/resolve", {
        body: { data: [{ trackId: 1 }] },
      }).as("getFavorites");
      cy.visit("/");
      cy.get("button[data-cy=log-in]").click();
      cy.url().should("contain", Cypress.env("issuer"));
      cy.get("[type=email").type("listener@admin.com");
      cy.get("[type=password").type("test1234");
      cy.get("button").click();
      cy.get("button").click();
      cy.get("[data-cy=log-in]").contains("listener");
      // cy.setLoggedInUser();
      cy.memoryNavigate("/library/artist/49d2ac44-7f20-4a47-9cf5-3ea5d6ef78f6");
      cy.wait(["@getArtist"]).then(() => {});
    });

    it("should show favorite and add to playlist, and option to buy track", () => {
      cy.get("[aria-label='open track actions']").first().click();
      cy.get("[data-cy=modal]").contains("Buy now");
      cy.get("[data-cy=modal]").contains("Add to playlist");
      cy.get("[data-cy=modal]").contains("Add to favorites");
      cy.get("[data-cy=modal]").contains("Total remaining cost");
    });

    it("should show the buy album button", () => {
      cy.wait(["@getPlayCounts"])
        .then(() => {})
        .get("[data-cy=buy-album]")
        .contains("Buy album")
        .first()
        .click();
      cy.get("[data-cy=modal]").contains("Yes, please!");
    });
  });
});
