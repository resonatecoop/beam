import { css } from "@emotion/css";
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export const SearchResults: React.FC = () => {
  return (
    <>
      <h3>Explore Resonate</h3>
      <div>
        <ul
          className={css`
            list-style: none;
            margin: 0.5rem 0.5rem 0.5rem 0;
            border-bottom: 3px solid #ddd;

            > li {
              display: inline-block;

              a {
                color: #000;
                text-decoration: none;
                padding: 0.25rem 0.5rem 0.25rem 0.25rem;
                display: block;
                font-size: 1.2rem;
                transition: 0.1s border-bottom;

                &.active {
                  border-bottom: 3px solid var(--magenta);
                  margin-bottom: -3px;
                }

                &:hover {
                  border-bottom: 3px solid var(--magenta);
                  margin-bottom: -3px;
                }
              }
            }
          `}
        >
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
        </ul>
      </div>
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
