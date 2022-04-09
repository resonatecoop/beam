import React from "react";
import { css } from "@emotion/css";

import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as Icon } from "../assets/icon.svg";

import Login from "./Login";
import { Link } from "react-router-dom";
import { useGlobalStateContext } from "../contexts/globalState";
import constants from "../constants";

const headerClass = css`
  min-height: 48px;
  border-bottom: 1px solid grey;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  position: fixed;
  width: 100%;
  z-index: 10;
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

  .icon {
    display: none;
  }

  @media (max-width: ${constants.bp.small}px) {
    .full-logo {
      display: none;
    }
    .icon {
      display: block;
    }
  }
`;

const Header: React.FC = () => {
  const {
    state: { user, token },
  } = useGlobalStateContext();
  return (
    <header className={headerClass}>
      <Link to="/">
        <Logo className="full-logo" style={{ height: "46px" }} />
        <Icon className="icon" style={{ height: "46px" }} />
      </Link>
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
