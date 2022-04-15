import { css } from "@emotion/css";
import React from "react";
import { FaEdit, FaEye, FaLock } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { fetchUserTrackGroup } from "../services/Api";
import IconButton from "./common/IconButton";
import { CenteredSpinner } from "./common/Spinner";
import TrackTable from "./common/TrackTable";
import PlaylistTitleEditing from "./PlaylistTitleEditing";

export const PlaylistTracks: React.FC = () => {
  let { playlistId } = useParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [playlist, setPlaylist] = React.useState<Trackgroup>();
  const [tracks, setTracks] = React.useState<Track[]>();

  const fetchTracks = React.useCallback(async (playlistId: string) => {
    setIsLoading(true);

    const trackgroup = await fetchUserTrackGroup(playlistId);
    setPlaylist(trackgroup);

    setIsLoading(false);
    setTracks(trackgroup.items.map((item) => item.track));
  }, []);

  React.useEffect(() => {
    if (playlistId) {
      fetchTracks(playlistId);
    }
  }, [fetchTracks, playlistId]);

  const onDone = React.useCallback(() => {
    setIsEditing(false);
    if (playlistId) {
      fetchTracks(playlistId);
    }
  }, [playlistId, fetchTracks]);

  return (
    <div
      className={css`
        flex-grow: 1;
      `}
    >
      {!isEditing && !isLoading && (
        <>
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
            {playlist?.private ? <FaLock /> : <FaEye />}
            {playlist?.title ?? "Tracks"}{" "}
            <IconButton onClick={() => setIsEditing(true)}>
              <FaEdit />
            </IconButton>
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
        </>
      )}
      {playlist && isEditing && (
        <PlaylistTitleEditing playlist={playlist} onDone={onDone} />
      )}
      {isLoading && <CenteredSpinner />}
      {!isLoading && tracks && <TrackTable tracks={tracks} />}
    </div>
  );
};

export default PlaylistTracks;