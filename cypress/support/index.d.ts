declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to ... add your description here
     * @example cy.clickOnMyJourneyInCandidateCabinet()
     */
    isPlayingAudio(): Chainable<null>;
    isAudioPaused(): Chainable<null>;
    setLoggedInUser(): Chainable<null>;
    memoryNavigate(url: string): Chainable<null>;
  }
}
