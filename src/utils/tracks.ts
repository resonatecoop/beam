import produce from "immer";
import {
  checkPlayCountOfTrackIds,
  checkTrackIdsForFavorite,
} from "../services/Api";

const STREAM_API = "https://stream.resonate.coop/api/v3/user/stream/";

export const mapFavoriteAndPlaysToTracks = async (
  checkTracks: Track[]
): Promise<TrackWithUserCounts[]> => {
  const favorites = await checkTrackIdsForFavorite(
    checkTracks.map((c) => c.id)
  );
  const plays = await checkPlayCountOfTrackIds(checkTracks.map((c) => c.id));

  return checkTracks.map(
    produce((t) => ({
      ...t,
      favorite: !!favorites.find((f) => f.track_id === t.id),
      plays: plays.find((f) => f.track_id === t.id)?.count ?? 0,
    }))
  );
};

export function formatCredit(tokens: number) {
  return (tokens / 1000).toFixed(4);
}

export function calculateCost(count: number) {
  if (count > 8) {
    return 0;
  }
  for (var cost = 2, i = 0; i < count; ) {
    cost *= 2;
    i++;
  }
  return cost;
}

export function calculateRemainingCost(count: number) {
  if (count > 8) {
    return 0;
  }
  for (var cost = 0, i = 0; i < count; ) {
    cost += calculateCost(i);
    i++;
  }
  return 1022 - cost;
}

export function buildStreamURL(id?: number, clientId?: string) {
  return `${STREAM_API}${id}${clientId ? `?token=${clientId}` : ""}`;
}

export const determineNewTrackOrder = produce(
  (
    oldTracks: (TrackWithUserCounts | Track)[],
    droppedInId: string,
    draggingTrackId: number
  ) => {
    const dragIdx = oldTracks.findIndex(
      (track) => track.id === draggingTrackId
    );
    const dropIdx = oldTracks.findIndex(
      (track) => `${track.id}` === droppedInId
    );
    const draggedItem = oldTracks.splice(dragIdx, 1);
    oldTracks.splice(dropIdx, 0, draggedItem[0]);
    return oldTracks;
  }
);
