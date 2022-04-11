import { GlobalState } from "../contexts/globalState";

const API = "https://stream.resonate.coop/api/";

const fetchWrapper = async (
  url: string,
  options: RequestInit,
  apiOptions?: APIOptions
) => {
  const apiVersion = apiOptions?.apiVersion ?? "v2";

  const stateString = localStorage.getItem("state");
  let state: undefined | GlobalState;
  try {
    state = JSON.parse(stateString ?? "");
  } catch (e) {}
  let fullUrl = `${API}${apiVersion}/${url}`;
  if (apiOptions && options.method === "GET") {
    const params = new URLSearchParams();
    Object.keys(apiOptions).forEach((key) => {
      params.set(key, `${apiOptions[key]}`);
    });
    fullUrl += `?${params}`;
  }
  return fetch(fullUrl, {
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

export const logInUserWithPassword = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<{
  access_token: string;
  access_token_expires: string;
  client_id: string;
}> => {
  return fetchWrapper(
    "oauth2/password",
    {
      method: "POST",
      body: JSON.stringify({ username, password }),
    },
    {
      apiVersion: "v1",
    }
  );
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

interface FetchTrackGroupFilter extends APIOptions {
  type: TrackgroupType;
}

// FIXME: What's the difference between fetching a user's playlists
// (as with the staff picks) and fetching the user's trackgroups.
// Also note that if you don't supply a type, then the listing returns
// 0. That might be an API error?
export const fetchUserTrackGroups = async (
  options?: FetchTrackGroupFilter
): Promise<TrackgroupDetail[]> => {
  return fetchWrapper(
    `user/trackgroups`,
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

export const createTrackGroup = async (data: {
  cover: string;
  title: string;
  type: string;
}): Promise<TrackgroupDetail> => {
  return fetchWrapper(`user/trackgroups`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const fetchUserTrackGroup = async (
  id: string
): Promise<TrackgroupDetail> => {
  return fetchWrapper(`user/trackgroups/${id}`, {
    method: "GET",
  });
};

export const addTracksToTrackGroup = async (
  id: string,
  data: {
    tracks: { track_id: number }[];
  }
) => {
  return fetchWrapper(`user/trackgroups/${id}/items/add`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const fetchUserFavorites = async (): Promise<Track[]> => {
  return fetchWrapper("user/favorites", {
    method: "GET",
  });
};

export const addTrackToUserFavorites = async (id: number): Promise<Track[]> => {
  return fetchWrapper("user/favorites", {
    method: "POST",
    body: JSON.stringify({
      track_id: id,
    }),
  });
};

export const fetchByTag = async (tag: string): Promise<TagResult[]> => {
  return fetchWrapper(`tag/${tag}`, {
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

export const registerPlay = (
  userId: number,
  trackId: number
): Promise<void> => {
  return fetchWrapper(
    `users/${userId}/plays`,
    {
      method: "POST",
      body: JSON.stringify({ tid: trackId }),
    },
    {
      apiVersion: "v1",
    }
  );
};

export const fetchSearchResults = (
  searchString: string
): Promise<SearchResult[]> => {
  return fetchWrapper("search/", { method: "GET" }, { q: searchString });
};
