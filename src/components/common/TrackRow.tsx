import { css } from "@emotion/css";
import React from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGlobalStateContext } from "../../contexts/globalState";
import { isTrackWithUserCounts } from "../../typeguards";

import { FavoriteTrack } from "./FavoriteTrack";
import IconButton from "./IconButton";
import TrackPopup from "./TrackPopup";

const TrackRow: React.FC<{
  track: TrackWithUserCounts | Track;
  trackgroupId?: string;
  addTracksToQueue: (id: number) => void;
  reload: () => Promise<void>;
  handleDrag: (val: React.DragEvent<HTMLTableRowElement>) => void;
  handleDrop: (val: React.DragEvent<HTMLTableRowElement>) => void;
  editable?: boolean;
}> = ({
  track,
  addTracksToQueue,
  trackgroupId,
  reload,
  handleDrag,
  handleDrop,
  editable,
}) => {
  const {
    state: { playerQueueIds, playing },
    dispatch,
  } = useGlobalStateContext();

  const currentTrackId = playerQueueIds[0];

  const onTrackPlay = React.useCallback(() => {
    addTracksToQueue(track.id);
    dispatch({ type: "setPlaying", playing: true });
  }, [dispatch, addTracksToQueue, track.id]);

  const onTrackPause = React.useCallback(() => {
    dispatch({ type: "setPlaying", playing: false });
  }, [dispatch]);

  return (
    <tr
      key={track.id}
      id={`${track.id}`}
      onDragOver={(ev) => ev.preventDefault()}
      draggable={editable}
      onDragStart={handleDrag}
      onDrop={handleDrop}
      className={css`
        > td > .play-button {
          opacity: 0;
        }
        &:hover > td > .play-button {
          opacity: 1;
        }
      `}
    >
      <td>{isTrackWithUserCounts(track) && <FavoriteTrack track={track} />}</td>
      <td>
        {(!playing || currentTrackId !== track.id) && (
          <IconButton compact className="play-button" onClick={onTrackPlay}>
            <FaPlay />
          </IconButton>
        )}
        {playing && currentTrackId === track.id && (
          <IconButton compact onClick={onTrackPause}>
            <FaPause />
          </IconButton>
        )}
      </td>
      <td
        className={css`
          width: 40%;
          overflow: hidden;
          whitespace: nowrap;
          text-overflow: ellipsis;
        `}
      >
        {track.title}
      </td>
      <td
        className={css`
          width: 40%;
          overflow: hidden;
          whitespace: nowrap;
          text-overflow: ellipsis;
        `}
      >
        {track.album}
      </td>
      <td
        className={css`
          width: 20%;
          overflow: hidden;
          whitespace: nowrap;
          text-overflow: ellipsis;
        `}
      >
        <Link
          onClick={(e) => {
            e.stopPropagation();
          }}
          to={`/library/artist/${track.creator_id}`}
        >
          {track.artist}
        </Link>
      </td>
      <td>
        {isTrackWithUserCounts(track) && (
          <div
            className={css`
              display: flex;
            `}
          >
            <div
              className={css`
                width: ${track.plays * 3}px;
                height: 1rem;
                background-color: var(--magenta);
              `}
            />
            <div
              className={css`
                width: ${(9 - track.plays) * 3}px;
                height: 1rem;
                background-color: #cfcfcf;
              `}
            />
          </div>
        )}
      </td>
      <td>
        <TrackPopup
          trackId={(editable && track.id) || undefined}
          compact
          groupId={trackgroupId}
          reload={reload}
        />
      </td>
    </tr>
  );
};
export default TrackRow;
