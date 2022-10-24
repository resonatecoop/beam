import { resonateUrl } from "../constants";

export const API = `${resonateUrl}api/`;
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

export const getToken = (apiVersion?: string | number) => {
  let token: string | undefined = undefined;
  try {
    const stateString = localStorage.getItem("state");
    const state = JSON.parse(stateString ?? "");
    token = state?.token;
  } catch (e) {}

  let version = apiVersion ?? "v3";

  try {
    const oauthStateString = localStorage.getItem(oidcStorage);
    const oauthState = JSON.parse(oauthStateString ?? "");
    token = oauthState.access_token;
    version = apiVersion ?? "v3";
  } catch (e) {}
  return { token: token, version };
};

export const fetchWrapper = async (
  url: string,
  options: RequestInit,
  apiOptions?: APIOptions,
  pagination?: boolean,
  contentType?: string
) => {
  const { token, version: apiVersion } = getToken(apiOptions?.apiVersion);
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
      "Content-Type": contentType ? contentType : "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })
    .then((result) => {
      if (!result.ok) {
        if (result.status === 404) {
          throw new NotFoundError(result);
        }
      } else {
        // go the desired response
      }
      return result.json();
    })
    .then((result) => {
      if (pagination) {
        return result;
      }
      return result.data;
    });
};

export interface FetchTrackGroupFilter extends APIOptions {
  type?: TrackgroupType;
}

/**
 * Playlists
 */

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
}: TagOptions): Promise<APIPaginatedResult<TagResult>> => {
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

export const fetchLatestTracks = (
  options: APIOptions
): Promise<APIPaginatedResult<Track>> => {
  return fetchWrapper(
    `tracks/${options.order !== "random" ? "latest" : ""}`,
    {
      method: "GET",
    },
    options,
    true
  ).then((results) => {
    return { ...results, data: results.data.map((r: Track) => ({ ...r })) };
  });
};

export const fetchTrack = (trackId: number): Promise<Track> => {
  return fetchWrapper(`tracks/${trackId}`, {
    method: "GET",
  });
};

/**
 *  Search endpoints
 */

export const fetchSearchResults = (
  searchString: string
): Promise<SearchResult[] | null> => {
  return fetchWrapper(
    "search/",
    { method: "GET" },
    // NOTE: API is looking for actual "+" (%2B) values instead of whitespace (%20)
    { q: searchString.replace(/ /g, "+") }
  );
};
