import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { injectGlobal, css } from "@emotion/css";

import Home from "./components/Home";
import Library from "./components/Library";
import { useGlobalStateContext } from "./contexts/globalState";
import { fetchUserProfile } from "./services/Api";
import Profile from "./components/Profile";
import Header from "./components/Header";
import Player from "./components/Player";
import Queue from "./components/Queue";
import constants from "./constants";
import PlaylistTracks from "./components/PlaylistTracks";
import ArtistPage from "./components/ArtistPage";
import Favorites from "./components/Favorites";
import TrackgroupPage from "./components/TrackgroupPage";
import TagList from "./components/TagList";
import SearchResults from "./components/SearchResults";

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

  :root {
    --magenta: #c1006d;
    --dark-magenta: #770043;
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
    padding-bottom: 1rem;
  }

  h4 { 
    font-size: 1.4rem;
    padding-bottom: .75rem;
  }

  a {
    color: var(--magenta);
    transition: 0.25s color;
    &:hover {
      color: var(--dark-magenta);
    }
  }
`;

const appWrapper = css`
  position: relative;
  width: 100%;
`;

const contentWrapper = css`
  padding: calc(48px + 3rem) 1rem calc(48px + 5rem);
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
  const fetchUserProfileCallback = React.useCallback(async () => {
    const result = await fetchUserProfile();
    dispatch({ type: "setLoggedInUser", user: result });
  }, [dispatch]);

  React.useEffect(() => {
    if (token && token !== "") {
      fetchUserProfileCallback();
    }
  }, [fetchUserProfileCallback, token]);

  return (
    <div className={appWrapper}>
      <Header />
      <div className={contentWrapper}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tag/:tagString" element={<TagList />} />
          <Route path="/library" element={<Library />}>
            <Route path="queue" element={<Queue />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="playlist/:playlistId" element={<PlaylistTracks />} />
            <Route path="artist/:artistId" element={<ArtistPage />} />
            <Route
              path="trackgroup/:trackgroupId"
              element={<TrackgroupPage />}
            />

            <Route path="favorites" element={<Favorites />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Player />
    </div>
  );
}

export default App;
