import React, { createContext } from "react";
import produce from "immer";
import { shuffle } from "lodash";

export interface GlobalState {
  user?: LoggedInUser;
  playerQueueIds: number[];
  token?: string;
  playing?: boolean;
}

type SetLoggedInUser = {
  type: "setLoggedInUser";
  user?: LoggedInUser;
};

type ClearQueue = {
  type: "clearQueue";
};

type AddToBackQueue = {
  type: "addTrackIdsToBackOfQueue";
  idsToAdd: number[];
};

type AddToFrontQueue = {
  type: "addTrackIdsToFrontOfQueue";
  idsToAdd: number[];
};

type PopFromFrontOfQueue = {
  type: "popFromFrontOfQueue";
};

type ShuffleQueue = {
  type: "shuffleQueue";
};

type SetState = {
  type: "setState";
  state: GlobalState;
};

type SetToken = {
  type: "setToken";
  token: string;
};

type SetPlaying = {
  type: "setPlaying";
  playing: boolean;
};

type SetPlayerQueueIds = {
  type: "setPlayerQueueIds";
  playerQueueIds: number[];
};

type Actions =
  | SetLoggedInUser
  | SetState
  | AddToBackQueue
  | AddToFrontQueue
  | SetToken
  | PopFromFrontOfQueue
  | SetPlaying
  | ClearQueue
  | SetPlayerQueueIds
  | ShuffleQueue;

const stateReducer = produce((draft: GlobalState, action: Actions) => {
  let newDraft = draft;
  switch (action.type) {
    case "setState":
      newDraft = {
        ...action.state,
      };
      break;
    case "setLoggedInUser":
      newDraft.user = action.user;
      break;
    case "addTrackIdsToBackOfQueue":
      newDraft.playerQueueIds = [...draft.playerQueueIds, ...action.idsToAdd];
      break;
    case "addTrackIdsToFrontOfQueue":
      newDraft.playerQueueIds = [...action.idsToAdd, ...draft.playerQueueIds];
      break;
    case "popFromFrontOfQueue":
      newDraft.playerQueueIds.shift();
      break;
    case "setPlayerQueueIds":
      newDraft.playerQueueIds = action.playerQueueIds;
      break;
    case "shuffleQueue": {
      let shuffled: number[] = [];
      if (draft.playing) {
        const first = draft.playerQueueIds[0];
        shuffled = [first, ...shuffle(draft.playerQueueIds.slice(1))];
      } else {
        shuffled = shuffle(draft.playerQueueIds);
      }
      newDraft.playerQueueIds = shuffled;
      break;
    }
    case "clearQueue":
      newDraft.playerQueueIds = [];
      break;
    case "setToken":
      newDraft.token = action.token;
      break;
    case "setPlaying":
      newDraft.playing = action.playing;
      break;
    default:
      break;
  }
  localStorage.setItem(
    "state",
    JSON.stringify({ ...newDraft, playing: undefined }) // We don't want playing to be persisted
  );
  return newDraft;
});

const GlobalContext = createContext(
  {} as [GlobalState, React.Dispatch<Actions>]
);

interface GlobalStateProviderProps {
  initialState?: GlobalState;
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({
  children,
}) => {
  const storedStateString = localStorage.getItem("state");
  let storedState = undefined;
  try {
    storedState = JSON.parse(storedStateString ?? "");
  } catch (e) {}
  const [state, dispatch] = React.useReducer(
    stateReducer,
    storedState ?? { playerQueueIds: [] }
  );

  return (
    <GlobalContext.Provider value={[state, dispatch]}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalStateContext = () => {
  const [state, dispatch] = React.useContext(GlobalContext);

  return { state, dispatch };
};
