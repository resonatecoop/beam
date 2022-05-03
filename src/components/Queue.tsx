import { css } from "@emotion/css";
import React from "react";
import { MdShuffle } from "react-icons/md";
import { BiSad } from "react-icons/bi";
import { useGlobalStateContext } from "../contexts/globalState";
import { fetchTrack } from "../services/Api";
import Button from "./common/Button";
import TrackList from "./common/TrackList";
import EmptyBox from "./common/EmptyBox";
import { FullScreenSpinner } from "./common/Spinner";
import { determineNewTrackOrder } from "utils/tracks";
import { FaTrashAlt } from "react-icons/fa";

export const Queue: React.FC = () => {
  const {
    state: { playerQueueIds, draggingTrackId },
    dispatch,
  } = useGlobalStateContext();
  const [isLoading, setIsLoading] = React.useState(true);
  const [playerQueue, setPlayerQueue] = React.useState<Track[]>([]);

  const clearQueue = React.useCallback(() => {
    dispatch({ type: "clearQueue" });
  }, [dispatch]);

  const shuffleQueue = React.useCallback(() => {
    dispatch({
      type: "shuffleQueue",
    });
  }, [dispatch]);

  const fetchQueueDetails = React.useCallback(async (ids: number[]) => {
    if (ids && ids.length > 0) {
      const results = await Promise.all(
        ids.map((id) => {
          return fetchTrack(id);
        })
      );
      setPlayerQueue(
        results.map((result) => {
          // FIXME currentTrack.images doesn't contain small image URL
          return {
            ...result,
            images: {
              ...result.images,
              small: {
                ...(result.images.small ?? { width: 60, height: 60 }),
                url: result.images.small?.url ?? result.cover,
              },
            },
          };
        })
      );
      setIsLoading(false);
    } else {
      setPlayerQueue([]);
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchQueueDetails(playerQueueIds);
  }, [playerQueueIds, fetchQueueDetails]);

  const handleDrop = React.useCallback(
    async (ev: React.DragEvent<HTMLLIElement>) => {
      ev.preventDefault();
      if (draggingTrackId) {
        const droppedInId = ev.currentTarget.id;
        const newTracks = determineNewTrackOrder(
          playerQueue,
          droppedInId,
          draggingTrackId
        );
        dispatch({
          type: "setPlayerQueueIds",
          playerQueueIds: newTracks.map((t) => t.id),
        });
      }
    },
    [playerQueue, draggingTrackId, dispatch]
  );

  return (
    <>
      {isLoading && playerQueue.length > 0 && <FullScreenSpinner />}

      <div
        className={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        `}
      >
        <h3>Queue</h3>
        <div
          className={css`
            flex-grow: 1;
          `}
        />
        {!isLoading && playerQueue?.length > 0 && (
          <>
            <Button
              compact
              onClick={shuffleQueue}
              startIcon={<MdShuffle />}
              style={{ marginRight: ".5rem" }}
            >
              Shuffle
            </Button>
            <Button compact onClick={clearQueue} startIcon={<FaTrashAlt />}>
              Clear queue
            </Button>
          </>
        )}
      </div>
      {!isLoading && playerQueue?.length === 0 && (
        <EmptyBox>
          <p>Your queue is empty</p>
          <p>Find some tracks to play!</p>
          <p>
            You can click on song's play buttons, add them from the dropdown, or
            click on their play and queue buttons.{" "}
          </p>
          <BiSad />
        </EmptyBox>
      )}
      {!isLoading && (
        <div data-cy="queue">
          <TrackList
            tracks={playerQueue}
            draggable
            fullWidth
            handleDrop={handleDrop}
          />
        </div>
      )}
    </>
  );
};

export default Queue;
