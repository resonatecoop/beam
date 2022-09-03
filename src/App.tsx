import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { injectGlobal, css } from "@emotion/css";

import Home from "./components/Home";
import Library from "./components/Library";
import { useGlobalStateContext } from "./contexts/globalState";
import { fetchUserProfile, fetchUserTrackGroups } from "./services/Api";
import Profile from "./components/Profile";
import Header from "./components/Header";
import Player from "./components/Player";
import Queue from "./components/Queue";
import { bp } from "./constants";
import PlaylistTracks from "./components/PlaylistTracks";
import ArtistPage from "./components/ArtistPage";
import Favorites from "./components/Favorites";
import History from "./components/History";

import TrackgroupPage from "./components/TrackgroupPage";
import TagList from "./components/TagList";
import SearchResults from "./components/SearchResults";
import Collection from "./components/Collection";
import LabelPage from "./components/LabelPage";
import Explore from "./components/Explore";
import Playlists from "./components/Explore/Playlists";
import Artists from "./components/Explore/Artists";
import Labels from "./components/Explore/Labels";
import Releases from "./components/Explore/Releases";
import Tracks from "./components/Explore/Tracks";
import SnackbarContext from "contexts/SnackbarContext";
import Snackbar from "components/common/Snackbar";
import styled from "@emotion/styled";
import { useAuth } from "./auth";
import Manage from "components/Manage";

// export default History;

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

  @media (prefers-color-scheme: dark) {
    body { background: #333; color: white; }
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

  h5 {
    font-size: 1.2rem;
    padding-bottom: .75rem;
  }

  @keyframes slide-down {
    from {
      opacity: 0;
      transform: translateY(-3rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(3rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes spinning {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;

  a {
    color: ${(props) => props.theme.colors.primary};
    transition: 0.25s color;
    &:hover {
      color: ${(props) => props.theme.colors.primaryHighlight};
    }
  }

  img {
    background: #dfdfdf;
  }
`;

const contentWrapper = css`
  padding: 2rem 1rem 6rem;
  // display: flex;
  min-height: calc(100vh - (180px));

  @media (max-width: ${bp.small}px) {
    padding-bottom: calc(150px + 3rem);
  }
`;

function App() {
  const { dispatch } = useGlobalStateContext();
  const { userData } = useAuth();
  const { isDisplayed } = useContext(SnackbarContext);

  const fetchUserProfileCallback = React.useCallback(async () => {
    const user = await fetchUserProfile();
    dispatch({ type: "setLoggedInUser", user });

    const playlists = await fetchUserTrackGroups({ type: "playlist" });
    dispatch({ type: "setUserPlaylists", playlists });
  }, [dispatch]);

  React.useEffect(() => {
    if (userData?.access_token && userData?.access_token !== "") {
      fetchUserProfileCallback();
      // setPlaylists(result);
    }
  }, [fetchUserProfileCallback, userData?.access_token]);

  return (
    <>
      {isDisplayed && <Snackbar />}
      <Wrapper>
        <Header />
        <div className={contentWrapper}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/manage" element={<Manage />} />
            <Route path="/library" element={<Library />}>
              <Route path="queue" element={<Queue />} />
              <Route path="search" element={<SearchResults />} />
              <Route path="explore" element={<Explore />}>
                <Route path="playlists" element={<Playlists />} />
                <Route path="artists" element={<Artists />} />
                <Route path="labels" element={<Labels />} />
                <Route path="releases" element={<Releases />} />
                <Route path="tracks" element={<Tracks />} />
              </Route>
              <Route path="playlist/:playlistId" element={<PlaylistTracks />} />
              <Route path="label/:labelId" element={<LabelPage />} />
              <Route path="artist/:artistId" element={<ArtistPage />} />
              <Route path="tag/:tagString" element={<TagList />} />
              <Route
                path="trackgroup/:trackgroupId"
                element={<TrackgroupPage />}
              />

              <Route path="favorites" element={<Favorites />} />
              <Route path="history" element={<History />} />
              <Route path="collection" element={<Collection />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Player />
      </Wrapper>
    </>
  );
}

export default App;
