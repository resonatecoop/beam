import produce from "immer";
import React from "react";
import { useGlobalStateContext } from "../../contexts/globalState";
import {
  fetchUserTrackGroup,
  setNewTracksOnTrackGroup,
} from "../../services/Api";

import { mapFavoriteAndPlaysToTracks } from "../../utils/tracks";
import { CenteredSpinner } from "./Spinner";
import Table from "./Table";
import TrackRow from "./TrackRow";

export const TrackTable: React.FC<{
  tracks: Track[];
  trackgroupId?: string;
  editable?: boolean;
}> = React.memo(({ tracks, trackgroupId, editable }) => {
  const [dragId, setDragId] = React.useState<string>();
  const {
    state: { user },
    dispatch,
  } = useGlobalStateContext();
  const handleDrag = (ev: React.DragEvent<HTMLTableRowElement>) => {
    setDragId(ev.currentTarget.id);
  };
  const [displayTracks, setDisplayTracks] = React.useState<
    (TrackWithUserCounts | Track)[]
  >([]);

  const determineNewTrackOrder = produce(
    (oldTracks: (TrackWithUserCounts | Track)[], droppedInId: string) => {
      const dragIdx = oldTracks.findIndex((track) => `${track.id}` === dragId);
      const dropIdx = oldTracks.findIndex(
        (track) => `${track.id}` === droppedInId
      );
      const draggedItem = oldTracks.splice(dragIdx, 1);
      oldTracks.splice(dropIdx, 0, draggedItem[0]);
      return oldTracks;
    }
  );

  const handleDrop = async (ev: React.DragEvent<HTMLTableRowElement>) => {
    const droppedInId = ev.currentTarget.id;
    const newTracks = determineNewTrackOrder(displayTracks, droppedInId);
    if (trackgroupId && editable) {
      setDisplayTracks(newTracks);

      await setNewTracksOnTrackGroup(trackgroupId, {
        tracks: newTracks.map((t, index) => ({
          track_id: t.id,
          index: index + 1,
        })),
      });
    }
  };

  const fetchTracks = React.useCallback(
    async (checkTracks: Track[]) => {
      if (user) {
        const newTracks = await mapFavoriteAndPlaysToTracks(checkTracks);
        setDisplayTracks(newTracks);
      } else {
        setDisplayTracks(checkTracks);
      }
    },
    [user]
  );

  React.useEffect(() => {
    fetchTracks(tracks);
  }, [tracks, fetchTracks]);

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

  const reload = React.useCallback(async () => {
    if (trackgroupId) {
      const newTracks = await fetchUserTrackGroup(trackgroupId);
      fetchTracks(newTracks.items.map((i) => i.track));
    }
  }, [fetchTracks, trackgroupId]);

  if (displayTracks.length === 0) {
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
            editable={editable}
            handleDrag={handleDrag}
            handleDrop={handleDrop}
          />
        ))}
      </tbody>
    </Table>
  );
});

export default TrackTable;
