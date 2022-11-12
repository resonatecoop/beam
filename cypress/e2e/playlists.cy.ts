/// <reference types="cypress" />

describe("playlist", () => {
  beforeEach(() => {
    window.localStorage.setItem(
      `oidc.user:https://id.resonate.coop:${Cypress.env("client_id")}`,
      JSON.stringify({ access_token: "1234" })
    );
    cy.intercept("GET", Cypress.env("API") + "user/profile/", {
      fixture: "user.json",
    }).as("getProfile");
    cy.visit("/");
  });

  it("navigate to editing a playlist", () => {
    cy.intercept("GET", Cypress.env("API") + "user/trackgroups?*", {
      fixture: "userPlaylists.json",
    }).as("getTrackgroups");
    cy.intercept("GET", Cypress.env("API") + "user/trackgroups/*", {
      fixture: "emptyUserPlaylist.json",
    }).as("getOneTrackgroup");
    cy.get("header").contains("Library").click();
    cy.get("[data-cy=sidebar-playlist]").first().click();
    cy.wait("@getOneTrackgroup").then(() => {});
    cy.get("div").contains("There's no tracks yet in this playlist!");
    cy.get(`[aria-label="edit playlist"]`).click();
    cy.get("button").contains("Cancel changes");
    cy.get("button").contains("Delete");
    cy.get("button").contains("Save");
  });
});
