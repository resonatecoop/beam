import { cloneDeep, isEqual } from "lodash";
import React from "react";
import { useGlobalStateContext } from "contexts/globalState";
import { fetchUserTrackGroup, setNewTracksOnTrackGroup } from "services/Api";

import {
  determineNewTrackOrder,
  mapFavoriteAndPlaysToTracks,
} from "utils/tracks";
import { CenteredSpinner } from "./Spinner";
import Table from "./Table";
import TrackRow from "./TrackRow";

export const TrackTable: React.FC<{
  tracks: Track[];
  trackgroupId?: string;
  editable?: boolean;
}> = React.memo(
  ({ tracks, trackgroupId, editable }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const {
      state: { user, draggingTrackId },
      dispatch,
    } = useGlobalStateContext();

    const [displayTracks, setDisplayTracks] = React.useState<
      (TrackWithUserCounts | Track)[]
    >([]);

    const handleDrop = React.useCallback(
      async (ev: React.DragEvent<HTMLTableRowElement>) => {
        ev.preventDefault();
        if (editable && draggingTrackId) {
          const droppedInId = ev.currentTarget.id;
          const newTracks = determineNewTrackOrder(
            displayTracks,
            droppedInId,
            draggingTrackId
          );
          if (trackgroupId) {
            setDisplayTracks(newTracks);

            await setNewTracksOnTrackGroup(trackgroupId, {
              tracks: newTracks.map((t, index) => ({
                track_id: t.id,
                index: index + 1,
              })),
            });
          }
        }
      },
      [displayTracks, editable, trackgroupId, draggingTrackId]
    );

    const fetchTracks = React.useCallback(
      async (checkTracks: Track[]) => {
        const cloned = cloneDeep(checkTracks);

        if (user) {
          const newTracks = await mapFavoriteAndPlaysToTracks(cloned);
          setDisplayTracks(newTracks);
        } else {
          setDisplayTracks(cloned);
        }
        setIsLoading(false);
      },
      [user]
    );

    React.useEffect(() => {
      setIsLoading(true);
      fetchTracks(tracks);
    }, [tracks, fetchTracks]);

    const addTracksToQueue = React.useCallback(
      (id: number) => {
        const idx = tracks.findIndex((track) => track.id === id);
        dispatch({
          type: "setPlayerQueueIds",
          playerQueueIds: tracks
            .slice(idx, tracks.length)
            .map((track) => track.id),
        });
      },
      [dispatch, tracks]
    );

    const reload = React.useCallback(async () => {
      if (trackgroupId) {
        const newTracks = await fetchUserTrackGroup(trackgroupId);
        fetchTracks(newTracks.items.map((i) => i.track));
      }
    }, [fetchTracks, trackgroupId]);

    if (isLoading) {
      return <CenteredSpinner />;
    }

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
              trackgroupId={trackgroupId}
              reload={reload}
              handleDrop={handleDrop}
            />
          ))}
          {displayTracks.length === 0 && (
            <tr>
              <td colSpan={999} style={{ textAlign: "center" }}>
                There's no tracks yet in this playlist!
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    );
  },
  (before, after) => {
    if (isEqual(before, after)) {
      return false;
    }
    return true;
  }
);

export default TrackTable;
