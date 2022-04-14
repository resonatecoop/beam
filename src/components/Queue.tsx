import { css } from "@emotion/css";
import React from "react";
import { useGlobalStateContext } from "../contexts/globalState";
import { fetchTrack } from "../services/Api";
import Button from "./common/Button";
import TrackList from "./common/TrackList";

export const Queue: React.FC = () => {
  const {
    state: { playerQueueIds },
    dispatch,
  } = useGlobalStateContext();

  const [playerQueue, setPlayerQueue] = React.useState<Track[]>([]);

  const clearQueue = React.useCallback(() => {
    dispatch({ type: "clearQueue" });
  }, [dispatch]);

  const fetchQueueDetails = React.useCallback(async () => {
    if (playerQueueIds && playerQueueIds.length > 0) {
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
    } else {
      setPlayerQueue([]);
    }
  }, [playerQueueIds]);

  React.useEffect(() => {
    fetchQueueDetails();
  }, [playerQueueIds, fetchQueueDetails]);

  return (
    <>
      <div
        className={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        `}
      >
        <h3>Queue</h3>
        <Button compact onClick={clearQueue}>
          Clear Queue
        </Button>
      </div>
      {playerQueue?.length === 0 && (
        <div
          className={css`
            width: 100%;
            text-align: center;
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #777;
          `}
        >
          Your queue is empty :( Find some songs to play!
        </div>
      )}
      <div>
        <TrackList tracks={playerQueue} />
      </div>
    </>
  );
};

export default Queue;
