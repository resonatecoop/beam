import {
  checkPlayCountOfTrackIds,
  checkTrackIdsForFavorite,
} from "../services/Api";

export const mapFavoriteAndPlaysToTracks = async (
  checkTracks: Track[]
): Promise<TrackWithUserCounts[]> => {
  const favorites = await checkTrackIdsForFavorite(
    checkTracks.map((c) => c.id)
  );
  const plays = await checkPlayCountOfTrackIds(checkTracks.map((c) => c.id));

  return checkTracks.map((t) => ({
    ...t,
    favorite: !!favorites.find((f) => f.track_id === t.id),
    plays: plays.find((f) => f.track_id === t.id)?.count ?? 0,
  }));
};
