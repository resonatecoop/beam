/**
 * User track groups
 */

import {
  API,
  errorHandler,
  FetchTrackGroupFilter,
  fetchWrapper,
  getToken,
} from "services/Api";

export const fetchUserProfile = async (): Promise<LoggedInUser> => {
  return fetchWrapper("user/profile/", {
    method: "GET",
  });
};

export const updateUserProfile = async (data: {
  // email: string;
  displayName: string;
  newsletterNotification: boolean;
}): Promise<LoggedInUser> => {
  return fetchWrapper("user/profile/", {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const fetchPublicUserPlaylists = async (
  id: number,
  options?: APIOptions
): Promise<Trackgroup[]> => {
  return fetchWrapper(
    `users/${id}/playlists`,
    {
      method: "GET",
    },
    options
  );
};

/**
 * User playlists
 */

export const createPlaylist = async (data: {
  title: string;
}): Promise<TrackgroupDetail> => {
  return fetchWrapper(`user/playlists`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updatePlaylist = async (
  id: string,
  data: {
    cover: string;
    title: string;
    private: boolean;
    tags: string[];
    type: string;
    about?: string;
  }
): Promise<TrackgroupDetail> => {
  return fetchWrapper(`user/playlists/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const fetchUserPlaylists = async (): Promise<TrackgroupDetail[]> => {
  return fetchWrapper(`user/playlists`, {
    method: "GET",
  });
};

export const fetchUserPlaylist = async (
  id: string
): Promise<TrackgroupDetail> => {
  return fetchWrapper(`user/playlists/${id}`, {
    method: "GET",
  });
};

export const addTracksToPlaylist = async (
  id: string,
  data: {
    tracks: { trackId: string }[];
  }
) => {
  return fetchWrapper(`user/playlists/${id}/items/add`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const removeTracksFromPlaylist = async (
  id: string,
  data: {
    tracks: { trackId: string }[];
  }
) => {
  return fetchWrapper(`user/playlists/${id}/items/remove`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const setNewTracksOnPlaylist = async (
  id: string,
  data: {
    tracks: { trackId: string; index?: number }[];
  }
) => {
  return fetchWrapper(`user/playlists/${id}/items`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteUserPlaylist = async (id: string) => {
  return fetchWrapper(`user/playlists/${id}`, {
    method: "DELETE",
  });
};

export const uploadPlaylistCover = async (id: string, file: File) => {
  var fd = new FormData();
  const { token } = getToken();
  fd.append("file", file);
  return fetch(`${API}user/playlists/${id}/cover`, {
    method: "PUT",
    body: fd,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }).then(errorHandler);
};

/**
 * User Track groups
 */

export const createTrackGroup = async (data: {
  title: string;
  type: string;
  artistId: string;
  releaseDate: string;
  about: string;
}): Promise<TrackgroupDetail> => {
  return fetchWrapper(`user/trackgroups`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateTrackGroup = async (
  id: string,
  data: Partial<{
    cover: string;
    title: string;
    private: boolean;
    tags: string[];
    type: string;
    about?: string;
  }>
): Promise<TrackgroupDetail> => {
  return fetchWrapper(`user/trackgroups/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

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
    tracks: { trackId: string }[];
  }
) => {
  return fetchWrapper(`user/trackgroups/${id}/items/add`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const removeTracksFromTrackGroup = async (
  id: string,
  data: {
    tracks: { trackId: string }[];
  }
) => {
  return fetchWrapper(`user/trackgroups/${id}/items/remove`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const setNewTracksOnTrackGroup = async (
  id: string,
  data: {
    tracks: { trackId: string; index?: number }[];
  }
) => {
  return fetchWrapper(`user/trackgroups/${id}/items`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteUserTrackGroup = async (id: string) => {
  return fetchWrapper(`user/trackgroups/${id}`, {
    method: "DELETE",
  });
};

export const uploadTrackGroupCover = async (id: string, file: File) => {
  var fd = new FormData();
  const { token } = getToken();
  fd.append("file", file);
  return fetch(`${API}user/trackgroups/${id}/cover`, {
    method: "PUT",
    body: fd,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }).then(errorHandler);
};

/**
 * User artist endpoints
 */

export const fetchUserArtists = (
  options?: APIOptions
): Promise<APIPaginatedResult<Artist>> => {
  return fetchWrapper(
    `user/artists`,
    {
      method: "GET",
    },
    options,
    true
  );
};

export const fetchUserArtist = (artistId: number): Promise<Artist> => {
  return fetchWrapper(`user/artists/${artistId}`, {
    method: "GET",
  });
};

export const createUserArtist = async (data: {
  displayName: string;
}): Promise<Artist> => {
  return fetchWrapper(`user/artists`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateUserArtist = async (
  id: string,
  data: {
    displayName: string;
  }
): Promise<Artist> => {
  return fetchWrapper(`user/artists/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

/**
 * user tracks
 */

export const createTrack = async (data: {
  track_name: string;
  status: number;
}) => {
  return fetchWrapper(`user/tracks`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const deleteTrack = async (id: string) => {
  return fetchWrapper(`user/tracks/${id}`, {
    method: "DELETE",
  });
};

export const uploadTrackFile = async (id: number, data: any) => {
  var fd = new FormData();
  fd.append("files", data.upload[0]);
  const { token } = getToken();
  // This doesn't use fetchwrapper because we don't know
  // how to set the multipart form data content delimiter
  return fetch(`${API}user/tracks/${id}/file`, {
    method: "PUT",
    body: fd,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }).then(errorHandler);
};

/**
 * Misc user info
 */

export const fetchUserStats = async (
  from: string,
  to: string
): Promise<Stat[]> => {
  return fetchWrapper(`user/plays/stats?from=${from}&to=${to}`, {
    method: "GET",
  });
};

export const fetchUserArtistHistory = async (
  options?: APIOptions
): Promise<APIPaginatedResult<{ uid: number; meta_value: string }>> => {
  return fetchWrapper(
    "user/plays/history/artists",
    { method: "GET" },
    options,
    true
  );
};

export const fetchUserCollection = async (
  options?: APIOptions
): Promise<APIPaginatedResult<Track>> => {
  return fetchWrapper("user/collection/", { method: "GET" }, options, true);
};

export const fetchUserHistory = async (
  options?: APIOptions
): Promise<APIPaginatedResult<Track>> => {
  return fetchWrapper("user/plays/history/", { method: "GET" }, options, true);
};

export const fetchUserFavorites = async (
  options?: APIOptions
): Promise<APIPaginatedResult<Track>> => {
  return fetchWrapper(
    "user/favorites",
    {
      method: "GET",
    },
    options,
    true
  );
};

export const addTrackToUserFavorites = async (id: string): Promise<Track[]> => {
  return fetchWrapper("user/favorites", {
    method: "POST",
    body: JSON.stringify({
      trackId: id,
    }),
  });
};

export const checkTrackIdsForFavorite = async (
  ids: string[]
): Promise<{ trackId: string }[]> => {
  const params = new URLSearchParams();
  ids.forEach((id) => {
    params.append("ids", `${id}`);
  });
  const query = params.toString();
  return fetchWrapper(`user/favorites/resolve?${query}`, {
    method: "GET",
  });
};

/**
 * User plays
 */

export const registerPlay = (
  trackId: string
): Promise<{ count: number; cost: number; total: number }> => {
  return fetchWrapper(`user/plays`, {
    method: "POST",
    body: JSON.stringify({ trackId }),
  });
};

export const buyTrack = async (trackId: string) => {
  return fetchWrapper(`user/plays/buy`, {
    method: "POST",
    body: JSON.stringify({
      trackId,
    }),
  });
};

export const checkPlayCountOfTrackIds = async (
  ids: string[]
): Promise<{ trackId: string; count: number }[]> => {
  const params = new URLSearchParams();
  ids.forEach((id) => {
    params.append("ids", `${id}`);
  });
  const query = params.toString();

  return fetchWrapper(`user/plays/resolve?${query}`, {
    method: "GET",
  });
};

/**
 * Products
 */

export interface Product {
  id: string;
  images: string[];
  name: string;
  default_price: string;
  price: {
    unit_amount: number;
    type: "one_time" | "recurring";
    currency: "eur";
    id: string;
  };
}

export const fetchProducts = async (): Promise<Product[]> => {
  return fetchWrapper("user/products", {
    method: "GET",
  });
};
