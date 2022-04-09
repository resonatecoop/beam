import produce from "immer";
import React, { createContext } from "react";

interface LibraryState {
  selectedPlaylistId?: string;
  playlists: TrackgroupDetail[];
}

type SetPlaylists = {
  type: "setPlaylists";
  playlists: TrackgroupDetail[];
};

type SetSelectedPlaylistId = {
  type: "setSelectedPlaylistId";
  id: string;
};
type Actions = SetPlaylists | SetSelectedPlaylistId;

export const libraryReducer = produce(
  (draft: LibraryState, action: Actions) => {
    switch (action.type) {
      case "setPlaylists":
        draft.playlists = action.playlists;
        break;
      case "setSelectedPlaylistId":
        draft.selectedPlaylistId = action.id;
        break;
      default:
        break;
    }
  }
);

export const LibraryContext = createContext(
  {} as [LibraryState, React.Dispatch<Actions>]
);

export const LibraryStateProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(libraryReducer, { playlists: [] });

  return (
    <LibraryContext.Provider value={[state, dispatch]}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibraryStateContext = () => {
  const [state, dispatch] = React.useContext(LibraryContext);

  return { state, dispatch };
};
