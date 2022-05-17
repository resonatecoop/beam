/// <reference types="cypress" />

describe("artist page", () => {
  describe("unauthenticated", () => {
    beforeEach(() => {
      cy.intercept(Cypress.env("API") + "artists/*").as("getArtist");
      // NOTE: navigation via URL won't work within electron because
      // we use the MemoryRouter there.
      cy.memoryNavigate("/library/artist/20230");
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
      cy.get("[data-cy=modal]").contains("Karen Vogt");
      cy.get("[data-cy=modal]").contains("Share & embed");
      cy.get("[data-cy=modal]").contains("Artist page");
    });
  });
  describe("authenticated", () => {
    beforeEach(() => {
      cy.intercept(Cypress.env("API") + "artists/*").as("getArtist");
      cy.intercept(Cypress.env("API") + "user/plays/resolve", {
        body: { data: [{ count: 1, track_id: 1 }] },
      }).as("getPlayCounts");
      cy.intercept(Cypress.env("API") + "user/favorites/resolve", {
        body: { data: [{ track_id: 1 }] },
      }).as("getFavorites");

      cy.setLoggedInUser();
      cy.memoryNavigate("/library/artist/20230");
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
