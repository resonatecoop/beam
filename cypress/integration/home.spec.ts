/// <reference types="cypress" />

describe("home page", () => {
  describe("unauthenticated", () => {
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
      cy.intercept(Cypress.env("API") + "stream/*").as("getTrackAudio");

      cy.get("h4").next("button").click();
      cy.wait(["@getTrackAudio"]).then(() => {
        cy.isPlayingAudio();
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

      cy.get("table").contains("Title");
    });

    it("should navigate to a new releases artist", () => {
      const regexString = Cypress.env("API") + "artists/\\d*";
      const regex = new RegExp(regexString);
      cy.intercept(regex).as("getArtist");
      cy.intercept(Cypress.env("API") + "artists/*/releases", {
        fixture: "artistRelease.json",
      }).as("getRelease");
      cy.wait("@getArtist").then(() => {});
      cy.get("h3")
        .contains("New releases")
        .next("ul")
        .within(() => {
          cy.get("li a[data-cy='artist-link']").first().click();
        });
      cy.get("h2").contains("Library");
      cy.wait("@getArtist").then(() => {});
      cy.wait("@getRelease").then(() => {});
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
      cy.intercept(Cypress.env("API") + "tracks/*").as("trackDetails");
      cy.get("h4").next("button").click();
      cy.get("[data-cy=queue]").contains("Queue").click();
      cy.get("h3").contains("Queue");
      // eslint-disable-next-line jest/valid-expect-in-promise
      cy.get("[data-cy='queue'] ul li").then((els) => {
        const l = els.length;
        expect(l).greaterThan(1);
        // els.should("have.length.at.least", 1);
        let array = [];
        for (let i = 0; i < l; i++) {
          array.push("@trackDetails");
        }
        return cy.wait(array).then(() => {
          cy.isPlayingAudio();
          cy.get("[aria-label=Pause]").click();
          cy.get("button").contains("Clear queue").scrollIntoView().click();
          cy.get("div").contains("Your queue is empty");
        });
      });
    });
  });

  describe("authenticated", () => {
    beforeEach(() => {
      window.localStorage.setItem(
        `oidc.user:https://id.resonate.coop:${Cypress.env("client_id")}`,
        JSON.stringify({ access_token: "1234" })
      );
      cy.intercept("GET", Cypress.env("API") + "user/profile/", {
        fixture: "user.json",
      }).as("getProfile");
      cy.visit("/");
      cy.wait("@getProfile").then(() => {});
    });

    it("should show the user's username in the header", () => {
      cy.get("header").contains("schmee");
    });

    it("should be able to navigate to the user's library", () => {
      cy.intercept("GET", Cypress.env("API") + "artists?limit=50&page=1").as(
        "getArtists"
      );
      cy.intercept(
        "GET",
        Cypress.env("API") + "tracks/latest?limit=50&order=plays&page=1"
      ).as("getPlays");
      cy.get("a").contains("Library").click();
      cy.get("h2").contains("Library");
      cy.get("h3")
        .contains("Explore Resonate")
        .next("div")
        .within(() => {
          cy.get("li a").contains("Artists").click();
        });
      cy.wait("@getArtists").then(() => {
        cy.get("img").should("have.length.above", 1);
      });
      cy.get("li a").contains("Labels").click();
      cy.get("li a").contains("Releases").click();
      cy.get("li a").contains("Tracks").click();
      cy.get("select").select("plays");
      cy.wait("@getPlays").then(() => {});
      cy.get("h3")
        .contains("Explore Resonate")
        .next("div")
        .next("div")
        .within(() => {
          cy.get("li a").should("have.length.above", 1);
        });
    });
  });
});
