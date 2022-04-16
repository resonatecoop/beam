import { css } from "@emotion/css";
import React from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { bp } from "../constants";
import { useGlobalStateContext } from "../contexts/globalState";
import { fetchUserTrackGroups } from "../services/Api";
import AddPlaylist from "./AddPlaylist";
import { listButtonClass } from "./common/ListButton";

const divider = css`
  margin: 0 0 1rem;
  border: none;
  border-top: 1px solid #aaa;
`;

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
        @media (max-width: ${bp.small}px) {
          max-width: inherit;
        }
      `}
    >
      <AddPlaylist />
      <ul
        className={css`
          list-style: none;

          > li:nth-of-type(odd) {
            background-color: #dfdfdf;
          }
        `}
      >
        <li>
          <NavLink className={listButtonClass} to="/library/history">
            History
          </NavLink>
        </li>
        <hr className={divider} />
        <li>
          <NavLink className={listButtonClass} to="/library/collection">
            Collection
          </NavLink>
        </li>
        <li>
          <NavLink className={listButtonClass} to="/library/favorites">
            Favorites
          </NavLink>
        </li>
        <hr className={divider} />
        {playlists?.map((playlist) => (
          <li key={playlist.id} className={css``}>
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
