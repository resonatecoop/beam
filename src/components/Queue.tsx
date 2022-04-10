import React from "react";
import { useGlobalStateContext } from "../contexts/globalState";
import { fetchTrack } from "../services/Api";
import TrackList from "./common/TrackList";

export const Queue: React.FC = () => {
  const {
    state: { playerQueueIds },
  } = useGlobalStateContext();

  const [playerQueue, setPlayerQueue] = React.useState<Track[]>([]);

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
                  ...result.images.small,
                  url: result.images.small?.url ?? result.cover,
                },
              },
            };
          })
        );
      });
    }
  }, [playerQueueIds]);

  React.useEffect(() => {
    fetchQueueDetails();
  }, [playerQueueIds, fetchQueueDetails]);

  return (
    <>
      <h3>Queue</h3>
      <div>
        <TrackList tracks={playerQueue} />
      </div>
    </>
  );
};

export default Queue;
