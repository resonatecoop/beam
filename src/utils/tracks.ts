import produce from "immer";
import {
  checkPlayCountOfTrackIds,
  checkTrackIdsForFavorite,
} from "../services/Api";

const STREAM_API = "https://api.resonate.coop/v1/stream/";

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
  return `${STREAM_API}${id}${clientId ? `?client_id=${clientId}` : ""}`;
}
