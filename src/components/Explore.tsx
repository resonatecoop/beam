import { css } from "@emotion/css";
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import Tabs from "./common/Tabs";

export const SearchResults: React.FC = () => {
  return (
    <>
      <h3>Explore Resonate</h3>
      <Tabs>
        <li>
          <NavLink to="playlists">Playlists</NavLink>
        </li>
        <li>
          <NavLink to="artists">Artists</NavLink>
        </li>
        <li>
          <NavLink to="labels">Labels</NavLink>
        </li>
        <li>
          <NavLink to="releases">Releases</NavLink>
        </li>
        <li>
          <NavLink to="tracks">Tracks</NavLink>
        </li>
      </Tabs>
      <div
        className={css`
          margin: 1rem 0 0;
        `}
      >
        <Outlet />
      </div>
    </>
  );
};

export default SearchResults;
