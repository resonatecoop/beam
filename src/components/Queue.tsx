import { css } from "@emotion/css";
import React from "react";
import { MdShuffle } from "react-icons/md";
import { useGlobalStateContext } from "../contexts/globalState";
import { fetchTrack } from "../services/Api";
import Button from "./common/Button";
import TrackList from "./common/TrackList";
import EmptyBox from "./common/EmptyBox";
import { FullScreenSpinner } from "./common/Spinner";
import { determineNewTrackOrder } from "utils/tracks";

export const Queue: React.FC = () => {
  const {
    state: { playerQueueIds, draggingTrackId },
    dispatch,
  } = useGlobalStateContext();
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [playerQueue, setPlayerQueue] = React.useState<Track[]>([]);

  const clearQueue = React.useCallback(() => {
    dispatch({ type: "clearQueue" });
  }, [dispatch]);

  const shuffleQueue = React.useCallback(() => {
    dispatch({
      type: "shuffleQueue",
    });
  }, [dispatch]);

  const fetchQueueDetails = React.useCallback(
    async (ids: number[], loadingFirstTime: boolean) => {
      if (ids && ids.length > 0) {
        if (loadingFirstTime) {
          setIsLoading(true);
        }
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
        setHasLoaded(true);
      } else {
        setPlayerQueue([]);
      }
    },
    []
  );

  React.useEffect(() => {
    fetchQueueDetails(playerQueueIds, !hasLoaded);
  }, [playerQueueIds, fetchQueueDetails, hasLoaded]);

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
        {!isLoading && playerQueue?.length > 0 && (
          <>
            <Button compact onClick={shuffleQueue} startIcon={<MdShuffle />}>
              Shuffle
            </Button>
            <Button compact onClick={clearQueue}>
              Clear queue
            </Button>
          </>
        )}
      </div>
      {!isLoading && playerQueue?.length === 0 && (
        <EmptyBox>Your queue is empty :( Find some songs to play!</EmptyBox>
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
