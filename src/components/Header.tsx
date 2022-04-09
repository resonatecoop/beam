import React from "react";
import { css } from "@emotion/css";

import Login from "./Login";
import { Link } from "react-router-dom";
import { useGlobalStateContext } from "../contexts/globalState";

const headerClass = css`
  min-height: 48px;
  border-bottom: 1px solid grey;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  position: fixed;
  width: 100%;
  z-index: 1;
  top: 0;
  background-color: #fff;

  a {
    text-decoration: none;
    color: black;
    margin-right: 1rem;
    transition: 0.25s color;
    &:hover {
      color: grey;
    }
  }
`;

const Header: React.FC = () => {
  const {
    state: { user, token },
  } = useGlobalStateContext();
  return (
    <header className={headerClass}>
      <Link to="/">no-logo</Link>
      <div
        className={css`
          flex-grow: 1;
        `}
      />
      {user && token && token !== "" && <Link to="/library">Library</Link>}
      <Login />
    </header>
  );
};

export default Header;
