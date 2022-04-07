import React, { createContext } from "react";
import produce from "immer";

export interface GlobalState {
  user?: LoggedInUser;
  playerQueueIds: number[];
  token?: string;
}

type SetLoggedInUser = {
  type: "setLoggedInUser";
  user: LoggedInUser;
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

type SetState = {
  type: "setState";
  state: GlobalState;
};

type SetToken = {
  type: "setToken";
  token: string;
};

type Actions =
  | SetLoggedInUser
  | SetState
  | AddToBackQueue
  | AddToFrontQueue
  | SetToken
  | PopFromFrontOfQueue;

const stateReducer = produce((draft: GlobalState, action: Actions) => {
  switch (action.type) {
    case "setState":
      return {
        ...action.state,
      };
    case "setLoggedInUser":
      return {
        ...draft,
        user: action.user,
      };
    case "addTrackIdsToBackOfQueue":
      return {
        ...draft,
        playerQueueIds: [...draft.playerQueueIds, ...action.idsToAdd],
      };
    case "addTrackIdsToFrontOfQueue":
      return {
        ...draft,
        playerQueueIds: [...action.idsToAdd, ...draft.playerQueueIds],
      };
    case "popFromFrontOfQueue":
      draft.playerQueueIds.shift();
      return draft;
    case "setToken":
      return {
        ...draft,
        token: action.token,
      };
    default:
      break;
  }
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
  const storedState = JSON.parse(storedStateString ?? "");
  const [state, dispatch] = React.useReducer(
    stateReducer,
    storedState ?? { playerQueueIds: [] }
  );

  React.useEffect(() => {
    localStorage.setItem("state", JSON.stringify(state));
  }, [state]);

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
