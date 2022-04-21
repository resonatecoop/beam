import { css } from "@emotion/css";
import React from "react";
import { MdShuffle } from "react-icons/md";
import { useGlobalStateContext } from "../contexts/globalState";
import { fetchTrack } from "../services/Api";
import Button from "./common/Button";
import TrackList from "./common/TrackList";
import EmptyBox from "./common/EmptyBox";
import { FullScreenSpinner } from "./common/Spinner";

export const Queue: React.FC = () => {
  const {
    state: { playerQueueIds },
    dispatch,
  } = useGlobalStateContext();

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

  const fetchQueueDetails = React.useCallback(async () => {
    if (playerQueueIds && playerQueueIds.length > 0) {
      setIsLoading(true);
      await Promise.all(
        playerQueueIds.map((id) => {
          return fetchTrack(id);
        })
      ).then((results) => {
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
      });
      setIsLoading(false);
    } else {
      setPlayerQueue([]);
    }
  }, [playerQueueIds]);

  React.useEffect(() => {
    fetchQueueDetails();
  }, [playerQueueIds, fetchQueueDetails]);

  return (
    <>
      {isLoading && <FullScreenSpinner />}

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
          <TrackList tracks={playerQueue} />
        </div>
      )}
    </>
  );
};

export default Queue;
