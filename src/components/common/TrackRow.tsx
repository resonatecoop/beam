import { css } from "@emotion/css";
import React from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGlobalStateContext } from "contexts/globalState";
import { isTrackWithUserCounts } from "typeguards";
import useDraggableTrack from "utils/useDraggableTrack";

import { FavoriteTrack } from "./FavoriteTrack";
import IconButton from "./IconButton";
import TrackPopup from "./TrackPopup";
import styled from "@emotion/styled";
import { colorShade } from "utils/theme";

const PlaysTracker = styled.div<{ width: number; played?: boolean }>`
  width: ${(props) => props.width}px;
  height: 1rem;
  background-color: ${(props) =>
    props.played
      ? props.theme.colors.primary
      : colorShade(props.theme.colors.background, -30)};
`;

const TrackRow: React.FC<{
  track: TrackWithUserCounts | Track;
  trackgroupId?: string;
  addTracksToQueue: (id: number) => void;
  reload: () => Promise<void>;
  handleDrop: (val: React.DragEvent<HTMLTableRowElement>) => void;
}> = ({ track, addTracksToQueue, trackgroupId, reload, handleDrop }) => {
  const {
    state: { playerQueueIds, playing, currentlyPlayingIndex },
    dispatch,
  } = useGlobalStateContext();
  const { onDragStart, onDragEnd } = useDraggableTrack();
  const currentTrackId = currentlyPlayingIndex
    ? playerQueueIds[currentlyPlayingIndex]
    : undefined;

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
      draggable={true}
      onDragStart={onDragStart}
      onDrop={handleDrop}
      onDragEnd={onDragEnd}
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
            <PlaysTracker width={track.plays * 3} played />
            <PlaysTracker width={(9 - track.plays) * 3} />
          </div>
        )}
      </td>
      <td>
        <TrackPopup
          trackId={track.id}
          compact
          groupId={trackgroupId}
          reload={reload}
        />
      </td>
    </tr>
  );
};
export default TrackRow;
