import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { injectGlobal, css } from "@emotion/css";

import Home from "./components/Home";
import Library from "./components/Library";
import { useGlobalStateContext } from "./contexts/globalState";
import { fetchUserProfile } from "./services/Api";
import Profile from "./components/Profile";
import Header from "./components/Header";
import Player from "./components/Player";
import Queue from "./components/Queue";
import { FaChevronLeft } from "react-icons/fa";
import IconButton from "./components/common/IconButton";
import constants from "./constants";
import PlaylistTracks from "./components/PlaylistTracks";

injectGlobal`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  @font-face {
    font-family: 'Patrick Hand SC';
    font-style: normal;
    font-weight: 400;
    src: local('Patrick Hand SC'),
      local('PatrickHandSC-Regular'),
      url(https://fonts.gstatic.com/s/patrickhandsc/v4/OYFWCgfCR-7uHIovjUZXsZ71Uis0Qeb9Gqo8IZV7ckE.woff2)
        format('woff2');
    unicode-range: U+0100-024f, U+1-1eff,
      U+20a0-20ab, U+20ad-20cf, U+2c60-2c7f,
      U+A720-A7FF;
  }

  html {
    font-size: 18px;
  }

  h1 {
    font-size: 3rem;
  }

  h2 {
    font-size: 2.5rem;
  }

  h3 {
    font-size: 1.8rem;
  }

  h4 { 
    font-size: 1.4rem;
  }
`;

const appWrapper = css`
  position: relative;
  width: 100%;
`;

const contentWrapper = css`
  padding: calc(48px + 3rem) 1rem calc(48px + 3rem);
  min-height: 100vh;
  background-color: #efefef;

  @media (max-width: ${constants.bp.small}px) {
    padding-bottom: calc(150px + 3rem);
  }
`;

function App() {
  const {
    state: { token },
    dispatch,
  } = useGlobalStateContext();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const fetchUserProfileCallback = React.useCallback(async () => {
    const result = await fetchUserProfile();
    console.log("fetched", result);
    dispatch({ type: "setLoggedInUser", user: result });
  }, [dispatch]);

  React.useEffect(() => {
    if (token && token !== "") {
      console.log("fetching user profile", token);
      fetchUserProfileCallback();
    }
  }, [fetchUserProfileCallback, token]);

  const onBackClick = React.useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className={appWrapper}>
      <Header />
      <div className={contentWrapper}>
        {pathname !== "/" && (
          <IconButton onClick={onBackClick}>
            <FaChevronLeft />
          </IconButton>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/library" element={<Library />}>
            <Route path=":playlistId" element={<PlaylistTracks />} />
          </Route>

          <Route path="/queue" element={<Queue />} />
        </Routes>
      </div>
      <Player />
    </div>
  );
}

export default App;
