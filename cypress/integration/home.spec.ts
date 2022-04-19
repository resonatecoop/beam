/// <reference types="cypress" />

const expectPlayingAudio = () => {
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
};

describe("home page", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("/");
  });

  describe("unauthenticated", () => {
    it("navigate the home page", () => {
      cy.get("h2").should("contain", "co-operative");
      cy.get("h3").should("contain", "New releases");
      cy.get("h3").should("contain", "Staff picks");
    });

    it("should be able to play a staff pick playlist", () => {
      cy.intercept("https://api.resonate.coop/v1/stream/*").as("getTrackAudio");

      cy.get("h4").next("button").click();
      cy.wait(["@getTrackAudio"]).then(() => {
        expectPlayingAudio();
      });
    });

    it("should navigate to a new releases playlist", () => {
      cy.get("h3")
        .contains("New releases")
        .next("ul")
        .within(() => {
          cy.get("a").first().click();
        });
      cy.get("h2").contains("Library");
      cy.location().should((loc) => {
        expect(loc.href).contain("library/trackgroup");
      });
      cy.get("table").contains("Title");
    });

    it("should navigate to a new releases artist", () => {
      cy.get("h3")
        .contains("New releases")
        .next("ul")
        .within(() => {
          cy.get("li a").last().click();
        });
      cy.get("h2").contains("Library");
      cy.location().should((loc) => {
        expect(loc.href).contain("library/artist");
      });
      cy.get("h4").contains("Top Tracks");
      cy.get("h4").contains("Releases");

      cy.get("table").contains("Title");
    });

    it("should search", () => {
      cy.get("header form input").click();
      cy.get("header form > div").contains("Type something to start searching");
      cy.get("header form input").type("hello{Enter}", { force: true });
      cy.get("h2").contains("Library");
      cy.get("h3").contains('Results for "hello"');
    });

    it("can clear a queue", () => {
      cy.get("h4").next("button").click();
      cy.get("button").contains("Queue").click();
      cy.get("h3").contains("Queue");
      cy.get("[data-cy='queue'] img").should("not.have.length", 0);
      cy.get("button").contains("Clear queue").click();
      cy.get("div").contains("Your queue is empty");
    });
  });
});
