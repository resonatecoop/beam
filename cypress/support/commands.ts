/// <reference types="cypress" />

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("isPlayingAudio", () => {
  cy.get("audio,video").should((els) => {
    let audible = false;
    els.each((i, el) => {
      // @ts-ignore
      if (el.duration > 0 && !el.paused && !el.muted) {
        audible = true;
      }

      // expect(el.duration > 0 && !el.paused && !el.muted).to.eq(false)
    });
    expect(audible).eq(true);
  });
});

Cypress.Commands.add("isAudioPaused", () => {
  cy.get("audio,video").should((els) => {
    let paused = false;
    els.each((i, el) => {
      // @ts-ignore
      if (el.duration > 0 && el.paused && !el.muted) {
        paused = true;
      }

      // expect(el.duration > 0 && !el.paused && !el.muted).to.eq(false)
    });
    expect(paused).eq(true);
  });
});

Cypress.Commands.add("setLoggedInUser", () => {
  window.localStorage.setItem(
    `oidc.user:${Cypress.env("API")}:${Cypress.env("client_id")}`,
    JSON.stringify({ access_token: "1234" })
  );
  cy.intercept("GET", Cypress.env("API") + "user/profile/", {
    fixture: "user.json",
  }).as("getProfile");
});

Cypress.Commands.add("memoryNavigate", (url: string) => {
  cy.visit("/");
  cy.get("h2")
    .should("contain", "co-operative")
    .then(() => {
      cy.window().then((win) => {
        cy.log("navigating to", url);
        // @ts-ignore
        win.AppHistory?.navigate(url);
      });
    });
});
