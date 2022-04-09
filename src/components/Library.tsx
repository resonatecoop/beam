import { css } from "@emotion/css";
import React from "react";
import { LibraryContext, libraryReducer } from "../contexts/libraryState";
import { PlaylistListing } from "./PlaylistListing";
import constants from "../constants";
import { Outlet } from "react-router-dom";

export const Library: React.FC = () => {
  const [state, dispatch] = React.useReducer(libraryReducer, { playlists: [] });

  const onClick = (id: string) => {
    dispatch({ type: "setSelectedPlaylistId", id });
  };

  return (
    <LibraryContext.Provider value={[state, dispatch]}>
      <h2>Playlists</h2>
      <div
        className={css`
          display: flex;

          @media (max-width: ${constants.bp.small}px) {
            flex-direction: column;
          }
        `}
      >
        <PlaylistListing onClick={onClick} />
        <Outlet />
      </div>
    </LibraryContext.Provider>
  );
};

export default Library;
