export function isTrack(entity: unknown): entity is Track {
  if (!entity) {
    return false;
  }
  return (entity as Track).artist !== undefined;
}

export function isTrackgroup(entity: unknown): entity is Trackgroup {
  if (!entity) {
    return false;
  }
  return (entity as Trackgroup).display_artist !== undefined;
}

export function isTagResult(entity: unknown): entity is TagResult {
  if (!entity) {
    return false;
  }
  return (entity as TagResult)._id !== undefined;
}

export function isArtistSearchResult(
  entity: unknown
): entity is ArtistSearchResult {
  if (!entity) {
    return false;
  }
  return (entity as ArtistSearchResult).kind === "artist";
}

export function isTrackSearchResult(
  entity: unknown
): entity is TrackSearchResult {
  if (!entity) {
    return false;
  }
  return (entity as TrackSearchResult).kind === "track";
}
