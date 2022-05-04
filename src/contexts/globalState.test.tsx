import { stateReducer } from "./globalState";

describe("globalState", () => {
  describe("manipulate playerQueue", () => {
    it("should set a playerQueue", () => {
      const previousState = {
        playerQueueIds: [],
      };

      const state = stateReducer(previousState, {
        type: "setPlayerQueueIds",
        playerQueueIds: [1, 2, 3],
      });

      expect(state).toEqual({
        playerQueueIds: [1, 2, 3],
        currentlyPlayingIndex: 0,
      });
    });

    it("should add tracks to back of queue", () => {
      const previousState = {
        playerQueueIds: [3, 4],
      };

      const state = stateReducer(previousState, {
        type: "addTrackIdsToBackOfQueue",
        idsToAdd: [5, 6, 7],
      });

      expect(state).toEqual({
        playerQueueIds: [3, 4, 5, 6, 7],
      });
    });

    it("should shuffle newly added ids if shuffle is on", () => {
      const previousState = {
        playerQueueIds: [3, 4],
        shuffle: true,
      };

      const state = stateReducer(previousState, {
        type: "addTrackIdsToBackOfQueue",
        idsToAdd: [5, 6, 7],
      });

      expect(state).not.toEqual({
        playerQueueIds: [3, 4, 5, 6, 7],
      });
      state.playerQueueIds.forEach((id) => {
        expect([3, 4, 5, 6, 7]).toContain(id);
      });
    });
  });
});
