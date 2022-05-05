import React from "react";
import { css } from "@emotion/css";

import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as Icon } from "../assets/icon.svg";

import Login from "./Login";
import { Link } from "react-router-dom";
import { useGlobalStateContext } from "../contexts/globalState";
import { bp } from "../constants";
import Search from "./Search";
import styled from "@emotion/styled";
import { NewsBanner } from "./NewsBanner";
import { colorShade } from "utils/theme";

const Wrapper = styled.header`
  min-height: 48px;
  border-bottom: 1px solid ${(props) => colorShade(props.theme.colors.text, 20)};
  display: flex;
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
  background-color: #fff;

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
      scale: 0.8;
    }
  }

  .icon {
    display: none;
  }

  @media (max-width: ${bp.small}px) {
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
    state: { user },
  } = useGlobalStateContext();

  return (
    <Wrapper>
      <NewsBanner />
      <Content>
        <Link to="/">
          <Logo className="full-logo" style={{ height: "46px" }} />
          <Icon className="icon" style={{ height: "46px" }} />
        </Link>
        <div
          className={css`
            flex-grow: 1;
          `}
        />
        <Search />
        {user && <Link to="/library/explore/playlists">Library</Link>}
        <Login />
      </Content>
    </Wrapper>
  );
};

export default Header;
