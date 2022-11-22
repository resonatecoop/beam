import { cloneDeep } from "lodash";
import React from "react";
import { useGlobalStateContext } from "contexts/globalState";
import {
  fetchUserPlaylist,
  fetchUserTrackGroup,
  setNewTracksOnPlaylist,
  setNewTracksOnTrackGroup,
} from "services/api/User";

import {
  determineNewTrackOrder,
  mapFavoriteAndPlaysToTracks,
} from "utils/tracks";
import { CenteredSpinner } from "./Spinner";
import Table from "./Table";
import TrackRow from "./TrackRow";
import { isIndexedTrack } from "typeguards";

export const TrackTable: React.FC<{
  tracks: Track[];
  isPlaylist?: boolean;
  trackgroupId?: string;
  editable?: boolean;
  owned?: boolean;
  reload?: () => Promise<void>;
}> = ({ tracks, trackgroupId, editable, isPlaylist, owned, reload }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    state: { user, draggingTrackId },
    dispatch,
  } = useGlobalStateContext();
  const userId = user?.id;
  const [displayTracks, setDisplayTracks] = React.useState<
    (TrackWithUserCounts | IndexedTrack | Track)[]
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

          if (isPlaylist) {
            await setNewTracksOnPlaylist(trackgroupId, {
              tracks: newTracks.map((t, index) => ({
                trackId: t.id,
                index: index + 1,
              })),
            });
          } else {
            await setNewTracksOnTrackGroup(trackgroupId, {
              tracks: newTracks.map((t, index) => ({
                trackId: t.id,
                index: index + 1,
              })),
            });
          }
        }
      }
    },
    [displayTracks, editable, isPlaylist, trackgroupId, draggingTrackId]
  );

  const fetchTracks = React.useCallback(
    async (checkTracks: Track[]) => {
      const cloned = cloneDeep(checkTracks);

      if (userId) {
        const newTracks = await mapFavoriteAndPlaysToTracks(cloned);
        setDisplayTracks(newTracks);
      } else {
        setDisplayTracks(cloned);
      }
      setIsLoading(false);
    },
    [userId]
  );

  React.useEffect(() => {
    setIsLoading(true);
    fetchTracks(tracks);
  }, [tracks, fetchTracks]);

  const addTracksToQueue = React.useCallback(
    (id: string) => {
      const idx = tracks.findIndex((track) => track.id === id);
      dispatch({
        type: "startPlayingIds",
        playerQueueIds: tracks
          .slice(idx, tracks.length)
          .map((track) => track.id),
      });
    },
    [dispatch, tracks]
  );

  const reloadWrapper = React.useCallback(async () => {
    if (trackgroupId) {
      const fetchGroup = isPlaylist ? fetchUserPlaylist : fetchUserTrackGroup;
      const newTracks = await fetchGroup(trackgroupId);
      fetchTracks(newTracks.items.map((i) => i.track));

      if (reload) {
        await reload();
      }
    }
  }, [fetchTracks, isPlaylist, trackgroupId, reload]);

  if (isLoading) {
    return <CenteredSpinner />;
  }

  return (
    <Table style={{ marginBottom: "1.5rem", marginTop: "1.5rem" }}>
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
            key={
              isIndexedTrack(track) ? `${track.index}+${track.id}` : track.id
            }
            track={track}
            addTracksToQueue={addTracksToQueue}
            trackgroupId={trackgroupId}
            reload={reloadWrapper}
            isPlaylist={isPlaylist}
            handleDrop={handleDrop}
            owned={owned}
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
};

export default TrackTable;
