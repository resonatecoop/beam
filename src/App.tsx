import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { injectGlobal, css } from "@emotion/css";

import Home from "./components/Home";
import Library from "./components/Library";
import { useGlobalStateContext } from "./contexts/globalState";
import { fetchUserPlaylists, fetchUserProfile } from "./services/api/User";
import Profile from "./components/Profile";
import Header from "./components/Header";
import Player from "./components/Player";
import Queue from "./components/Queue";
import { bp } from "./constants";
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
import { useAuth } from "oidc-react";
import Manage from "components/ManageArtist/Manage";
import Admin from "components/Admin";
import AdminTrackgroups from "components/Admin/Trackgroups";
import AdminUsers from "components/Admin/Users";
import AdminTracks from "components/Admin/Tracks";
import UserDetails from "components/Admin/UserDetails";
import TrackgroupDetails from "components/Admin/TrackgroupDetails";
import TrackDetails from "components/Admin/TrackDetails";
import UpdateUserForm from "components/Admin/UpdateUserForm";
import PlaylistTracks from "components/PlaylistTracks";

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
    body {
      background: #333;
      color: white;
    }
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

const HasPermission: React.FC<{
  children: React.ReactElement;
  isLoading: boolean;
  roles?: ("user" | "artist" | "superadmin")[];
}> = ({ children, roles, isLoading }) => {
  const { userData, isLoading: loginLoading } = useAuth();
  const {
    state: { user },
  } = useGlobalStateContext();

  if (isLoading || loginLoading) {
    return <>Loading user info...</>;
  }

  const userIsArtist =
    (user?.userGroups?.length ?? 0) !== 0 || user?.role?.name === "artist";

  if (roles?.includes("artist") && !userIsArtist) {
    return <Navigate to="/" />;
  }
  if (roles?.includes("superadmin") && user?.role?.name !== "superadmin") {
    return <Navigate to="/" />;
  }
  if (!userData) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

function App() {
  const { dispatch } = useGlobalStateContext();
  const [isLoading, setIsLoading] = React.useState(true);
  const { userData } = useAuth();
  const { isDisplayed } = useContext(SnackbarContext);

  const fetchUserProfileCallback = React.useCallback(async () => {
    setIsLoading(true);
    const user = await fetchUserProfile();
    dispatch({ type: "setLoggedInUser", user });

    const playlists = await fetchUserPlaylists();
    dispatch({ type: "setUserPlaylists", playlists });
    setIsLoading(false);
  }, [dispatch]);

  const accessToken = userData?.access_token;
  const expired = userData?.expired;

  React.useEffect(() => {
    if (accessToken && accessToken !== "" && !expired) {
      fetchUserProfileCallback();
    }
  }, [fetchUserProfileCallback, accessToken, expired]);

  React.useEffect(() => {
    // FIXME: if userData is expired, then we should try to silently re-log in the user
    if (!userData || expired) {
      dispatch({ type: "setLoggedInUser", user: undefined });
    }
  }, [userData, dispatch, fetchUserProfileCallback, expired]);

  return (
    <>
      {isDisplayed && <Snackbar />}
      <Wrapper>
        <Header />
        <div className={contentWrapper}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/manage"
              element={
                <HasPermission roles={["artist"]} isLoading={isLoading}>
                  <Manage />
                </HasPermission>
              }
            >
              <Route path="earnings" element={<Manage />} />
              <Route path="files" element={<Manage />} />
              <Route path="plays" element={<Manage />} />
            </Route>
            <Route
              path="/admin"
              element={
                <HasPermission roles={["superadmin"]} isLoading={isLoading}>
                  <Admin />
                </HasPermission>
              }
            >
              <Route path="users" element={<AdminUsers />}>
                <Route path=":userId" element={<UserDetails />}>
                  <Route path="" element={<UpdateUserForm />} />
                  <Route path="releases" element={<>TODO</>} />
                  <Route path="analytics" element={<>TODO</>} />
                  <Route path="earnings" element={<>TODO</>} />
                </Route>
              </Route>

              <Route path="trackgroups" element={<AdminTrackgroups />}>
                <Route path=":trackgroupId" element={<TrackgroupDetails />} />
              </Route>
              <Route path="tracks" element={<AdminTracks />}>
                <Route path=":trackId" element={<TrackDetails />} />
              </Route>
              <Route path="" element={<Navigate to="users" />} />
            </Route>
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

              <Route
                path="favorites"
                element={
                  <HasPermission isLoading={isLoading}>
                    <Favorites />
                  </HasPermission>
                }
              />
              <Route
                path="history"
                element={
                  <HasPermission isLoading={isLoading}>
                    <History />
                  </HasPermission>
                }
              />
              <Route
                path="collection"
                element={
                  <HasPermission isLoading={isLoading}>
                    <Collection />
                  </HasPermission>
                }
              />
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
