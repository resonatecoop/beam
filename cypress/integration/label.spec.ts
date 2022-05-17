/// <reference types="cypress" />

describe("label page", () => {
  describe("unauthenticated", () => {
    beforeEach(() => {
      cy.intercept(Cypress.env("API") + "labels/*").as("getLabel");
      // NOTE: navigation via URL won't work within electron because
      // we use the MemoryRouter there.
      cy.memoryNavigate("/library/label/4088");
      cy.wait(["@getLabel"]).then(() => {});
    });

    it("should show artists on the label and navigate to the first one", () => {
      cy.intercept(Cypress.env("API") + "artists/*").as("getArtist");

      cy.get("h4")
        .contains("Artists")
        .next("ul")
        .children()
        .first()
        .children()
        .last()
        .click();
      cy.wait(["@getArtist"]).then(() => {});
    });
  });
});
