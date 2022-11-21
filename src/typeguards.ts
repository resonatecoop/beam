export function isTrack(entity: unknown): entity is Track {
  if (!entity) {
    return false;
  }
  return (entity as Track).creator !== undefined;
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

export function isTrackWithUserCounts(
  entity: unknown
): entity is TrackWithUserCounts {
  if (!entity) {
    return false;
  }
  return (entity as TrackWithUserCounts).favorite !== undefined;
}

export function isIndexedTrack(entity: unknown): entity is IndexedTrack {
  if (!entity) {
    return false;
  }
  return (entity as IndexedTrack).index !== undefined;
}
