import { css } from "@emotion/css";
import React from "react";
import { shuffle } from "lodash";
import { MdShuffle } from "react-icons/md";
import { useGlobalStateContext } from "../contexts/globalState";
import { fetchTrack } from "../services/Api";
import Button from "./common/Button";
import TrackList from "./common/TrackList";
import EmptyBox from "./common/EmptyBox";

export const Queue: React.FC = () => {
  const {
    state: { playerQueueIds },
    dispatch,
  } = useGlobalStateContext();

  const [playerQueue, setPlayerQueue] = React.useState<Track[]>([]);

  const clearQueue = React.useCallback(() => {
    dispatch({ type: "clearQueue" });
  }, [dispatch]);

  const shuffleQueue = React.useCallback(() => {
    const first = playerQueueIds[0];
    const shuffled = shuffle(playerQueueIds.slice(1));
    dispatch({
      type: "setPlayerQueueIds",
      playerQueueIds: [first, ...shuffled],
    });
  }, [dispatch, playerQueueIds]);

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
        <Button compact onClick={shuffleQueue}>
          <MdShuffle /> Shuffle
        </Button>
        <Button compact onClick={clearQueue}>
          Clear Queue
        </Button>
      </div>
      {playerQueue?.length === 0 && (
        <EmptyBox>Your queue is empty :( Find some songs to play!</EmptyBox>
      )}
      <div>
        <TrackList tracks={playerQueue} />
      </div>
    </>
  );
};

export default Queue;
