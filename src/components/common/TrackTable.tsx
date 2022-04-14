import { css } from "@emotion/css";
import React from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGlobalStateContext } from "../../contexts/globalState";

import { mapFavoriteAndPlaysToTracks } from "../../utils/tracks";
import { FavoriteTrack } from "./FavoriteTrack";
import IconButton from "./IconButton";
import Table from "./Table";
import TrackPopup from "./TrackPopup";

const TrackRow: React.FC<{
  track: TrackWithUserCounts;
  addTracksToQueue: (id: number) => void;
}> = ({ track, addTracksToQueue }) => {
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
      className={css`
        > td > .play-button {
          opacity: 0;
        }
        &:hover > td > .play-button {
          opacity: 1;
        }
      `}
    >
      <td>
        <FavoriteTrack track={track} />
      </td>
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
      </td>
      <td>
        <TrackPopup trackId={track.id} compact />
      </td>
    </tr>
  );
};

export const TrackTable: React.FC<{ tracks: Track[] }> = ({ tracks }) => {
  const { dispatch } = useGlobalStateContext();
  const [displayTracks, setDisplayTracks] = React.useState<
    TrackWithUserCounts[]
  >([]);

  React.useEffect(() => {
    const fetchFavorites = async (checkTracks: Track[]) => {
      const newTracks = await mapFavoriteAndPlaysToTracks(checkTracks);

      setDisplayTracks(newTracks);
    };

    fetchFavorites(tracks);
  }, [tracks]);

  const addTracksToQueue = React.useCallback(
    (id: number) => {
      const idx = tracks.findIndex((track) => track.id === id);
      dispatch({
        type: "addTrackIdsToFrontOfQueue",
        idsToAdd: tracks.slice(idx, tracks.length).map((track) => track.id),
      });
    },
    [dispatch, tracks]
  );

  return (
    <Table style={{ marginBottom: "2rem" }}>
      <thead>
        <tr>
          <th />
          <th />
          <th>Title</th>
          <th>Album</th>
          <th>Artist</th>
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        {displayTracks?.map((track) => (
          <TrackRow
            key={track.id}
            track={track}
            addTracksToQueue={addTracksToQueue}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default TrackTable;
