import { css } from "@emotion/css";
import React from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import constants from "../constants";
import { useGlobalStateContext } from "../contexts/globalState";
import { fetchUserTrackGroups } from "../services/Api";
import AddPlaylist from "./AddPlaylist";
import { listButtonClass } from "./common/ListButton";

export const PlaylistListing: React.FC<{ onClick: (id: string) => void }> = ({
  onClick,
}) => {
  const {
    state: { user },
  } = useGlobalStateContext();
  const { playlistId } = useParams();
  const { pathname } = useLocation();

  const navigate = useNavigate();
  const userId = user?.id;
  const [playlists, setPlaylists] = React.useState<TrackgroupDetail[]>();

  const fetchPlaylistsCallback = React.useCallback(
    async (userId) => {
      const result = await fetchUserTrackGroups({ type: "playlist" });

      setPlaylists(result);
      if (
        !playlistId &&
        (pathname.includes("playlist") || pathname === "/library")
      ) {
        navigate(`/library/playlist/${result[0]?.id ?? ""}`);
      }
    },
    [navigate, playlistId, pathname]
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
        @media (max-width: ${constants.bp.small}px) {
          max-width: inherit;
        }
      `}
    >
      <AddPlaylist />
      <ul
        className={css`
          list-style: none;
        `}
      >
        <li>
          <NavLink className={listButtonClass} to="/library/favorites">
            Favorites
          </NavLink>
        </li>
        {playlists?.map((playlist) => (
          <li
            key={playlist.id}
            className={css`
              &:nth-child(odd) {
                background-color: #dfdfdf;
              }
            `}
          >
            <NavLink
              className={listButtonClass}
              to={`/library/playlist/${playlist.id}`}
            >
              {playlist.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
