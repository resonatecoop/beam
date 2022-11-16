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
import { checkPlayCountOfTrackIds } from "services/api/User";

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
  addTracksToQueue: (id: string) => void;
  reload: () => Promise<void>;
  handleDrop: (val: React.DragEvent<HTMLTableRowElement>) => void;
}> = ({ track, addTracksToQueue, trackgroupId, reload, handleDrop }) => {
  const [trackPlays, setTrackPlays] = React.useState(
    (isTrackWithUserCounts(track) && track.plays) || undefined
  );
  const loadedRef = React.useRef(false);
  const {
    state: { playerQueueIds, playing, currentlyPlayingIndex, user },
    dispatch,
  } = useGlobalStateContext();
  const { onDragStart, onDragEnd } = useDraggableTrack();

  const currentPlayingTrackId =
    currentlyPlayingIndex !== undefined
      ? playerQueueIds[currentlyPlayingIndex]
      : undefined;

  const onTrackPlay = React.useCallback(() => {
    addTracksToQueue(track.id);
    dispatch({ type: "setPlaying", playing: true });
  }, [dispatch, addTracksToQueue, track.id]);

  const onTrackPause = React.useCallback(() => {
    dispatch({ type: "setPlaying", playing: false });
  }, [dispatch]);

  const fetchTrackPlays = React.useCallback(async () => {
    const playCount = await checkPlayCountOfTrackIds([track.id]);
    setTrackPlays(playCount[0]?.count);
  }, [track.id]);

  React.useEffect(() => {
    if (loadedRef.current) {
      fetchTrackPlays();
    }
    loadedRef.current = true;
  }, [user?.credit.total, fetchTrackPlays]);

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
        {(!playing || currentPlayingTrackId !== track.id) && (
          <IconButton compact className="play-button" onClick={onTrackPlay}>
            <FaPlay />
          </IconButton>
        )}
        {playing && currentPlayingTrackId === track.id && (
          <IconButton
            compact
            data-cy="track-row-pause-button"
            onClick={onTrackPause}
          >
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
        {track.trackGroup && track.trackGroup.id && (
          <Link
            onClick={(e) => {
              e.stopPropagation();
            }}
            to={`/library/trackgroup/${track.trackGroup.id}`}
          >
            {track.trackGroup.title}
          </Link>
        )}
        {track.trackGroup && !track.trackGroup.id && track.trackGroup.title}
        {!track.trackGroup && track.album}
      </td>
      <td
        className={css`
          width: 20%;
          overflow: hidden;
          whitespace: nowrap;
          text-overflow: ellipsis;
        `}
      >
        {track.creator?.id && (
          <Link
            onClick={(e) => {
              e.stopPropagation();
            }}
            to={`/library/artist/${track.creator?.id}`}
          >
            {track.creator?.displayName}
          </Link>
        )}
        {!track.creator?.id && track.creator?.displayName}
      </td>
      <td>
        {trackPlays !== undefined && (
          <div
            className={css`
              display: flex;
            `}
          >
            <PlaysTracker width={trackPlays * 3} played />
            <PlaysTracker width={(9 - trackPlays) * 3} />
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
