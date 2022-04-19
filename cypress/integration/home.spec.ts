/// <reference types="cypress" />

const expectPlayingAudio = () => {
  cy.get("audio,video").should((els) => {
    let audible = false;
    els.each((i, el) => {
      console.log(el);
      // @ts-ignore
      console.log(el.duration, el.paused, el.muted);
      // @ts-ignore
      if (el.duration > 0 && !el.paused && !el.muted) {
        audible = true;
      }

      // expect(el.duration > 0 && !el.paused && !el.muted).to.eq(false)
    });
    expect(audible).eq(true);
  });
};

describe("home page", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("/");
  });

  it("navigate the home page", () => {
    cy.get("h2").should("contain", "co-operative");
    cy.get("h3").should("contain", "New releases");
    cy.get("h3").should("contain", "Staff picks");
  });

  it("should be able to play a staff pick playlist", () => {
    cy.intercept("https://api.resonate.coop/v1/stream/*").as("getTrackAudio");

    cy.get("h4").next("button").click();
    cy.wait(["@getTrackAudio"]).then(() => {
      console.log("waited");
      expectPlayingAudio();
    });
  });
});
