import { css } from "@emotion/css";
import styled from "@emotion/styled";
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const UL = styled.ul`
  list-style: none;
  margin: 0.5rem 0.5rem 0.5rem 0;
  border-bottom: 3px solid #ddd;

  > li {
    display: inline-block;
    margin-right: 1rem;
    a {
      color: #000;
      text-decoration: none;
      padding: 0.25rem 0.5rem 0.25rem 0.25rem;
      display: block;
      font-size: 1.2rem;
      transition: 0.1s border-bottom;

      &.active {
        border-bottom: 3px solid ${(props) => props.theme.colors.primary};
        margin-bottom: -3px;
      }

      &:hover {
        border-bottom: 3px solid ${(props) => props.theme.colors.primary};
        margin-bottom: -3px;
      }
    }
  }
`;

export const SearchResults: React.FC = () => {
  return (
    <>
      <h3>Explore Resonate</h3>
      <div>
        <UL>
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
        </UL>
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
