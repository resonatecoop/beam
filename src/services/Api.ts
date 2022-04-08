const API = "https://stream.resonate.coop/api/v2/";

const fetchWrapper = async (
  url: string,
  options: RequestInit,
  apiOptions?: APIOptions
) => {
  const stateString = localStorage.getItem("state");
  let state;
  try {
    state = JSON.parse(stateString ?? "");
  } catch (e) {}
  let fullUrl = `${API}${url}`;
  if (apiOptions) {
    const params = new URLSearchParams();
    Object.keys(apiOptions).forEach((key) => {
      params.set(key, `${apiOptions[key]}`);
    });
    fullUrl += `?${params}`;
  }

  return fetch(`${fullUrl}`, {
    headers: {
      "Content-Type": "application/json",
      ...(state && state.token
        ? { Authorization: `Bearer ${state.token}` }
        : {}),
    },
    ...options,
  })
    .then((result) => {
      return result.json();
    })
    .then((result) => {
      return result.data;
    });
};

export const fetchUserProfile = async (): Promise<LoggedInUser> => {
  return fetchWrapper("user/profile/", {
    method: "GET",
  });
};

export const fetchUserPlaylists = async (
  id: number,
  options?: APIOptions
): Promise<Playlist[]> => {
  return fetchWrapper(
    `users/${id}/playlists`,
    {
      method: "GET",
    },
    options
  );
};

export const fetchTrackGroups = async (
  options: APIOptions
): Promise<Trackgroup[]> => {
  return fetchWrapper(
    "trackgroups",
    {
      method: "GET",
    },
    options
  );
};

export const fetchTrackGroup = async (
  id: string
): Promise<TrackgroupDetail> => {
  return fetchWrapper(`trackgroups/${id}`, {
    method: "GET",
  });
};

export const fetchUserFavorites = async (): Promise<Track[]> => {
  return fetchWrapper("users/favorites", {
    method: "GET",
  });
};

export const fetchByTag = async (tag: string): Promise<TagResult[]> => {
  return fetchWrapper(`tags/${tag}`, {
    method: "GET",
  });
};

export const fetchArtist = (artistId: number): Promise<Artist> => {
  return fetchWrapper(`artists/${artistId}`, {
    method: "GET",
  });
};

export const fetchArtistReleases = (
  artistId: number
): Promise<ArtistRelease[]> => {
  return fetchWrapper(`artists/${artistId}/releases`, {
    method: "GET",
  });
};

export const fetchArtistTopTracks = (artistId: number): Promise<Track[]> => {
  return fetchWrapper(`artists/${artistId}/tracks/top`, {
    method: "GET",
  });
};

export const fetchTrack = (trackId: number): Promise<Track> => {
  return fetchWrapper(`tracks/${trackId}`, {
    method: "GET",
  });
};
