import { apiRoot, resonateUrl } from "../constants";

export const API = `${resonateUrl}${apiRoot}/`;
export const oidcStorage = `oidc.user:${process.env.REACT_APP_AUTHORITY}:${process.env.REACT_APP_CLIENT_ID}`;

class NotFoundError extends Error {
  constructor(params: any) {
    super(params);
    Object.setPrototypeOf(this, NotFoundError.prototype);
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }

    this.message = "Not Found";
  }
}

export const getToken = () => {
  let token: string | undefined = undefined;
  try {
    const stateString = localStorage.getItem("state");
    const state = JSON.parse(stateString ?? "");
    token = state?.token;
  } catch (e) {}

  try {
    const oauthStateString = localStorage.getItem(oidcStorage);
    const oauthState = JSON.parse(oauthStateString ?? "");
    token = oauthState.access_token;
  } catch (e) {}
  return { token: token };
};

export const errorHandler = async (result: Response) => {
  if (!result.ok) {
    if (result.status === 404) {
      throw new NotFoundError(result);
    }
    if (result.status === 400) {
      const error = await result.json();
      console.error(error.status, error.message, error);
      if (error.errors) {
        throw new Error("There was a problem communicating with the API");
      }
    }
    if (result.status === 500) {
      throw new Error("There was a problem communicating with the API");
    }
  }
};

export const fetchWrapper = async (
  url: string,
  options: RequestInit,
  apiOptions?: APIOptions,
  pagination?: boolean
) => {
  const { token } = getToken();
  let fullUrl = `${API}${url}`;
  if (apiOptions && options.method === "GET") {
    const params = new URLSearchParams();
    Object.keys(apiOptions).forEach((key) => {
      params.set(key, `${apiOptions[key]}`);
    });
    fullUrl += `?${params}`;
  }

  return fetch(fullUrl, {
    headers: {
      "Content-Type":
        apiOptions?.format && typeof apiOptions?.format === "string"
          ? apiOptions.format
          : "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })
    .then(async (result) => {
      await errorHandler(result);
      if (apiOptions?.format !== "application/csv") {
        return result.json();
      }
      return result.blob();
    })
    .then((result) => {
      if (pagination) {
        return result;
      }
      return result.data;
    });
};

/**
 * Playlists
 */

export interface FetchTrackGroupFilter extends APIOptions {
  type?: TrackgroupType;
}

export const fetchPlaylists = async (
  options?: FetchTrackGroupFilter
): Promise<APIPaginatedResult<Trackgroup>> => {
  return fetchWrapper(
    "playlists",
    {
      method: "GET",
    },
    options,
    true
  );
};

export const fetchPlaylist = async (id: string): Promise<TrackgroupDetail> => {
  return fetchWrapper(`playlists/${id}`, {
    method: "GET",
  });
};

/**
 * Track groups
 */

export const fetchTrackGroups = async (
  options?: FetchTrackGroupFilter
): Promise<APIPaginatedResult<Trackgroup>> => {
  return fetchWrapper(
    "trackgroups",
    {
      method: "GET",
    },
    options,
    true
  );
};

export const fetchTrackGroup = async (
  id: string
): Promise<TrackgroupDetail> => {
  return fetchWrapper(`trackgroups/${id}`, {
    method: "GET",
  });
};

interface TagOptions extends APIOptions {
  tag: string;
}

export const fetchByTag = async ({
  tag,
  ...options
}: TagOptions): Promise<{
  data: { trackgroups: Trackgroup[]; tracks: Track[] };
}> => {
  return fetchWrapper(
    `tag/${tag}`,
    {
      method: "GET",
    },
    options,
    true
  );
};
/**
 *  Label endpoints
 */

export const fetchLabels = (
  options?: APIOptions
): Promise<APIPaginatedResult<Label>> => {
  return fetchWrapper(`labels`, { method: "GET" }, options, true);
};

export const fetchLabel = (labelId: string): Promise<Label> => {
  return fetchWrapper(`labels/${labelId}`, {
    method: "GET",
  });
};

export const fetchLabelReleases = (labelId: string): Promise<Release[]> => {
  return fetchWrapper(`labels/${labelId}/releases`, {
    method: "GET",
  });
};

export const fetchLabelArtists = (labelId: string): Promise<LabelArtist[]> => {
  return fetchWrapper(`labels/${labelId}/artists`, {
    method: "GET",
  });
};

/**
 * Artist endpoints
 */

export const fetchArtists = (
  options?: APIOptions
): Promise<APIPaginatedResult<Artist>> => {
  return fetchWrapper(
    `artists`,
    {
      method: "GET",
    },
    options,
    true
  );
};

export const fetchArtist = (artistId: string): Promise<Artist> => {
  return fetchWrapper(`artists/${artistId}`, {
    method: "GET",
  });
};

export const fetchArtistReleases = (artistId: string): Promise<Release[]> => {
  return fetchWrapper(`artists/${artistId}/releases`, {
    method: "GET",
  });
};

export const fetchArtistTopTracks = (artistId: string): Promise<Track[]> => {
  return fetchWrapper(`artists/${artistId}/tracks/top`, {
    method: "GET",
  });
};

/**
 * Track endpoints
 */

export const fetchTracks = (
  options: APIOptions
): Promise<APIPaginatedResult<Track>> => {
  return fetchWrapper(
    `tracks`,
    {
      method: "GET",
    },
    options,
    true
  ).then((results) => {
    return { ...results, data: results.data.map((r: Track) => ({ ...r })) };
  });
};

export const fetchTrack = (trackId: string): Promise<Track> => {
  return fetchWrapper(`tracks/${trackId}`, {
    method: "GET",
  });
};

/**
 *  Search endpoints
 */

export const fetchSearchResults = (
  searchString: string
): Promise<{
  artists: Artist[];
  trackgroups: Trackgroup[];
  tracks: Track[];
  labels: Label[];
  bands: Artist[];
}> => {
  return fetchWrapper(
    "search/",
    { method: "GET" },
    // NOTE: API is looking for actual "+" (%2B) values instead of whitespace (%20)
    { q: searchString.replace(/ /g, "+") }
  );
};
