import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { useSnackbar } from "contexts/SnackbarContext";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { bp } from "../constants";
import { useGlobalStateContext } from "../contexts/globalState";
import { addTracksToPlaylist } from "../services/api/User";
import AddPlaylist from "./AddPlaylist";
import { NavLinkAsButton } from "./common/ListButton";

const divider = css`
  margin: 0 0 1rem;
  border: none;
  border-top: 1px solid #aaa;
`;

export const PlaylistListing: React.FC = () => {
  const {
    state: { user, userPlaylists },
  } = useGlobalStateContext();
  const { playlistId } = useParams();
  const { pathname } = useLocation();

  const navigate = useNavigate();
  const userId = user?.id;

  const fetchPlaylistsCallback = React.useCallback(
    async (userId) => {
      if (
        !playlistId &&
        (pathname.includes("playlist/") || pathname === "/library") &&
        userPlaylists
      ) {
        navigate(`/library/playlist/${userPlaylists[0]?.id ?? ""}`);
      }
    },
    [navigate, playlistId, userPlaylists, pathname]
  );

  React.useEffect(() => {
    if (userId) {
      fetchPlaylistsCallback(userId);
    }
  }, [fetchPlaylistsCallback, userId]);

  return (
    <div
      className={css`
        padding: 1rem 0;
        overflow-x: scroll;
        @media (max-width: ${bp.small}px) {
          max-width: inherit;
        }
      `}
    >
      <AddPlaylist refresh={() => fetchPlaylistsCallback(userId)} />
      <ul
        className={css`
          list-style: none;

          > li:nth-of-type(odd) {
            background-color: #dfdfdf;
            @media (prefers-color-scheme: dark) {
              background-color: #222;
            }
          }
        `}
      >
        <li>
          <NavLinkAsButton to="/library/explore/playlists">
            Explore
          </NavLinkAsButton>
        </li>
        <hr className={divider} />

        <li>
          <NavLinkAsButton to="/library/history">History</NavLinkAsButton>
        </li>
        <hr className={divider} />
        <li>
          <NavLinkAsButton to="/library/collection">Collection</NavLinkAsButton>
        </li>
        <li>
          <NavLinkAsButton to="/library/favorites">Favorites</NavLinkAsButton>
        </li>
        <hr className={divider} />
        {userPlaylists?.map((playlist) => (
          <PlaylistLI key={playlist.id} playlist={playlist} />
        ))}
      </ul>
    </div>
  );
};

const LI = styled.li<{ isHoveringOver: boolean }>`
  ${(props) =>
    props.isHoveringOver &&
    `
      background-color: ${props.theme.colors.primary} !important;

      > a {
        color: white;
      }
    `}
`;

const PlaylistLI: React.FC<{ playlist: { id: string; title: string } }> = ({
  playlist,
}) => {
  const snackbar = useSnackbar();
  const {
    state: { draggingTrackId },
  } = useGlobalStateContext();
  const [isHoveringOver, setIsHoveringOver] = React.useState(false);

  const onDragEnter = () => {
    setIsHoveringOver(true);
  };

  const onDragLeave = () => {
    setIsHoveringOver(false);
  };

  const onDrop = React.useCallback(
    async (id) => {
      if (draggingTrackId && id) {
        try {
          await addTracksToPlaylist(id, {
            tracks: [{ trackId: draggingTrackId }],
          });
          snackbar("Track added to playlist", { type: "success" });
        } catch (e) {
          console.error(e);
          snackbar("Something went wrong adding the track to the playlist", {
            type: "warning",
          });
        }
      }
      setIsHoveringOver(false);
    },
    [draggingTrackId, snackbar]
  );

  return (
    <LI
      onDrop={() => onDrop(playlist.id)}
      onDragOver={(ev) => ev.preventDefault()}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      isHoveringOver={isHoveringOver}
      data-cy="sidebar-playlist"
    >
      <NavLinkAsButton to={`/library/playlist/${playlist.id}`}>
        {playlist.title}
      </NavLinkAsButton>
    </LI>
  );
};
