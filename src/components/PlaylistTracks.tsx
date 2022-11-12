import { css } from "@emotion/css";
import React from "react";
import { FaEdit, FaEye, FaLock } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { fetchPlaylist } from "services/Api";
import { fetchUserPlaylist } from "services/api/User";
import { useGlobalStateContext } from "../contexts/globalState";
import IconButton from "./common/IconButton";
import { CenteredSpinner } from "./common/Spinner";
import TrackTable from "./common/TrackTable";
import PlaylistTitleEditing from "./PlaylistTitleEditing";

export const PlaylistTracks: React.FC = () => {
  let { playlistId } = useParams();
  const {
    state: { user },
  } = useGlobalStateContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [playlist, setPlaylist] = React.useState<TrackgroupDetail>();
  const [tracks, setTracks] = React.useState<IndexedTrack[]>([]);
  const userId = user?.id;
  const ownedByUser = userId && playlist?.creatorId === userId;

  const fetchTracks = React.useCallback(
    async (playlistId: string) => {
      setIsLoading(true);

      const fetchFunction = ownedByUser ? fetchUserPlaylist : fetchPlaylist;
      const trackgroup = await fetchFunction(playlistId);
      setPlaylist(trackgroup);
      setTracks(
        // FIXME: This should be changed back to item.index
        // when that's fixed on the API
        // https://github.com/resonatecoop/tracks-api/issues/34
        trackgroup.items.map((item, idx) => ({ ...item.track, index: idx }))
      );
      setIsLoading(false);
    },
    [ownedByUser]
  );

  React.useEffect(() => {
    if (playlistId) {
      fetchTracks(playlistId);
      setIsEditing(false);
    }
  }, [fetchTracks, playlistId]);

  const onDone = React.useCallback(
    (update?: boolean) => {
      setIsEditing(false);
      if (update && playlistId) {
        fetchTracks(playlistId);
      }
    },
    [playlistId, fetchTracks]
  );

  return (
    <div
      className={css`
        flex-grow: 1;
      `}
    >
      {!isEditing && !isLoading && (
        <div
          className={css`
            display: flex;
          `}
        >
          {playlist?.images.small && (
            <img
              alt="album cover"
              src={playlist?.images.small.url}
              className={css`
                margin-right: 1rem;
              `}
            />
          )}
          <div>
            <h3
              className={css`
                display: flex;
                align-items: center;

                > svg {
                  margin-right: 0.5rem;
                  font-size: 1rem;
                }

                button > svg {
                  margin-left: 0.5rem;
                }
              `}
            >
              {userId && (
                <>{ownedByUser && playlist?.private ? <FaLock /> : <FaEye />}</>
              )}
              {playlist?.title ?? "Tracks"}{" "}
              {ownedByUser && (
                <IconButton
                  onClick={() => setIsEditing(true)}
                  aria-label="edit playlist"
                >
                  <FaEdit />
                </IconButton>
              )}
            </h3>
            {playlist?.about && (
              <p
                className={css`
                  margin-bottom: 1rem;
                `}
              >
                {playlist.about}
              </p>
            )}
          </div>
        </div>
      )}
      {playlist && isEditing && (
        <PlaylistTitleEditing playlist={playlist} onDone={onDone} />
      )}
      {isLoading && <CenteredSpinner />}
      {!isLoading && playlist && (
        <TrackTable
          tracks={tracks}
          trackgroupId={playlist.id}
          isPlaylist
          editable={playlist.creatorId === userId}
        />
      )}
    </div>
  );
};

export default PlaylistTracks;
