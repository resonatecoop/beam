import { css } from "@emotion/css";
import React from "react";
import { FaPause, FaPlay, FaRegStar, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGlobalStateContext } from "../../contexts/globalState";
import {
  addTrackToUserFavorites,
  checkPlayCountOfTrackIds,
  checkTrackIdsForFavorite,
} from "../../services/Api";
import IconButton from "./IconButton";
import Table from "./Table";
import TrackPopup from "./TrackPopup";

interface TrackWithUserCounts extends Track {
  favorite: boolean;
  plays: number;
}

const TrackRow: React.FC<{
  track: TrackWithUserCounts;
  addTracksToQueue: (id: number) => void;
}> = ({ track, addTracksToQueue }) => {
  const [isFavorite, setIsFavorite] = React.useState(track.favorite);
  const [loadingFavorite, setLoadingFavorite] = React.useState(false);
  const {
    state: { playerQueueIds },
  } = useGlobalStateContext();

  const currentTrackId = playerQueueIds[0];

  const onTrackClick = React.useCallback(() => {
    addTracksToQueue(track.id);
  }, [addTracksToQueue, track.id]);

  const onClickStar = React.useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      setLoadingFavorite(true);

      await addTrackToUserFavorites(track.id);
      setIsFavorite((val) => !val);
      setLoadingFavorite(false);
    },
    [track.id]
  );

  return (
    <tr
      key={track.id}
      onClick={onTrackClick}
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
        <IconButton
          compact
          onClick={onClickStar}
          className={
            loadingFavorite
              ? css`
                  @keyframes spinning {
                    from {
                      transform: rotate(0deg);
                    }
                    to {
                      transform: rotate(360deg);
                    }
                  }
                  animation-name: spinning;
                  animation-duration: 0.5s;
                  animation-iteration-count: infinite;
                  /* linear | ease | ease-in | ease-out | ease-in-out */
                  animation-timing-function: linear;
                `
              : ""
          }
        >
          {isFavorite && <FaStar />}
          {!isFavorite && <FaRegStar />}
        </IconButton>
      </td>
      <td>
        {currentTrackId !== track.id && (
          <IconButton compact className="play-button">
            <FaPlay />
          </IconButton>
        )}
        {currentTrackId === track.id && (
          <IconButton compact>
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
      const favorites = await checkTrackIdsForFavorite(
        checkTracks.map((c) => c.id)
      );
      const plays = await checkPlayCountOfTrackIds(
        checkTracks.map((c) => c.id)
      );

      setDisplayTracks(
        checkTracks.map((t) => ({
          ...t,
          favorite: !!favorites.find((f) => f.track_id === t.id),
          plays: plays.find((f) => f.track_id === t.id)?.count ?? 0,
        }))
      );
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
