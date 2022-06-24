import React from "react";
import { css } from "@emotion/css";

import { ReactComponent as Logo } from "../assets/logo.svg";

import Login from "./Login";
import { Link } from "react-router-dom";
import { useGlobalStateContext } from "../contexts/globalState";
import { bp } from "../constants";
import Search from "./Search";
import styled from "@emotion/styled";
import { NewsBanner } from "./NewsBanner";
import { colorShade } from "utils/theme";
import SetupError from "./SetupError";

const Wrapper = styled.header`
  min-height: 48px;
  border-bottom: 1px solid ${(props) => colorShade(props.theme.colors.text, 20)};
  display: flex;
  filter: drop-shadow(0 0 0.15rem #000);
  flex-direction: column;
  position: sticky;
  width: 100%;
  z-index: 10;
  top: 0;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.background};
  position: relative;

  > a {
    text-decoration: none;
    color: ${(props) => props.theme.colors.text};
    margin-right: 1rem;
    max-height: 42px;
    transition: 0.25s color;
    &:hover {
      color: ${(props) => colorShade(props.theme.colors.text, 40)};
    }

    svg {
      scale: 0.7;
      margin-left: -0.5rem;
      height: 46px;
      @media (prefers-color-scheme: dark) {
        filter: invert(1);
      }
    }

    @media (prefers-color-scheme: dark) {
      color: ${(props) => props.theme.colors.textDark};
    }
  }

  .icon {
    display: none;
  }

  @media (max-width: ${bp.medium}px) {
    .full-logo {
      width: 64px;
      path {
        display: none;
        &:last-child {
          display: block;
        }
      }
    }
  }

  @media (prefers-color-scheme: dark) {
    background-color: ${(props) => props.theme.colors.backgroundDark};
  }
`;

const Header: React.FC = () => {
  const {
    state: { user },
  } = useGlobalStateContext();

  return (
    <Wrapper>
      <SetupError />
      <NewsBanner />
      <Content>
        <Link to="/">
          <Logo className="full-logo" style={{ height: "46px" }} />
        </Link>
        <div
          className={css`
            flex-grow: 1;
          `}
        />
        <Search />
        {user && (
          <Link to="/library/explore/playlists" data-cy="library-link">
            Library
          </Link>
        )}
        <Login />
      </Content>
    </Wrapper>
  );
};

export default Header;
