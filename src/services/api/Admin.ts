import { fetchWrapper } from "services/Api";

export const fetchCSVAndDownload = async (
  endpointFnc: (options: any) => Promise<any>,
  options: { [key: string]: any }
) => {
  const params = new URLSearchParams(options);
  const csv = (await endpointFnc({
    format: "application/csv",
    ...options,
  })) as unknown as Blob;
  const blobUrl = URL.createObjectURL(csv);
  const link = document.createElement("a"); // Or maybe get it from the current document
  link.href = blobUrl;
  const date = new Date();
  link.download = `user-table-${params.toString()}-${date.toISOString()}.csv`;
  link.click();
  window.URL.revokeObjectURL(blobUrl);
};

export interface AdminUser {
  country: string;
  displayName: string;
  email: string;
  emailConfirmed: boolean;
  fullName: string;
  id: string;
  member: string;
  role: { name: string; description: string };
  updatedAt?: string;
}

export const fetchUsers = (
  options: APIOptions
): Promise<APIPaginatedResult<AdminUser>> => {
  return fetchWrapper(
    "user/admin/users/",
    {
      method: "GET",
    },
    options,
    true
  );
};

export const fetchUser = (id: string): Promise<AdminUser> => {
  return fetchWrapper(`user/admin/users/${id}`, {
    method: "GET",
  });
};

/**
 * Admin TrackGroups
 */
export interface AdminTrackGroup {
  id: string;
  title: string;
  type: string;
  about: string;
  private: boolean;
  enabled: boolean;
  featured: boolean;
  creator: {
    id: string;
    displayName: string;
  };
  composers: string[];
  performers: string[];
  releaseDate: string;
  cover_metadata: unknown;
  tags: string[];
  images: ResonateImage;
}

export const fetchTrackGroups = (
  options: APIOptions
): Promise<APIPaginatedResult<AdminTrackGroup>> => {
  return fetchWrapper(
    "user/admin/trackgroups/",
    {
      method: "GET",
    },
    options,
    true
  );
};

export const fetchTrackGroup = (id: string): Promise<AdminTrackGroup> => {
  return fetchWrapper(`user/admin/trackgroups/${id}`, {
    method: "GET",
  });
};

export const updateTrackGroup = (
  id: string,
  data: AdminTrackGroup
): Promise<AdminTrackGroup> => {
  return fetchWrapper(`user/admin/trackgroups/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

/**
 * Admin TrackGroups
 */
export interface AdminPlaylist {
  id: string;
  title: string;
  about: string;
  private: boolean;
  featured: boolean;
  creator: {
    id: string;
    displayName: string;
  };
  tags: string[];
  images: ResonateImage;
}

export const fetchPlaylists = (
  options: APIOptions
): Promise<APIPaginatedResult<AdminPlaylist>> => {
  return fetchWrapper(
    "user/admin/playlists/",
    {
      method: "GET",
    },
    options,
    true
  );
};

export const fetchPlaylist = (id: string): Promise<AdminPlaylist> => {
  return fetchWrapper(`user/admin/playlists/${id}`, {
    method: "GET",
  });
};

export const updatePlaylist = (
  id: string,
  data: Partial<AdminPlaylist>
): Promise<AdminPlaylist> => {
  return fetchWrapper(`user/admin/playlists/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

/**
 * Admin Tracks
 */

export interface AdminTrack {
  id: number;
  title: string;
  trackGroup: { id: string; cover: string; title: string };
  creator?: { id: string; displayName: string };
  status: string;
  images: ResonateImage;
}

export const fetchTracks = (
  options: APIOptions
): Promise<APIPaginatedResult<AdminTrack>> => {
  return fetchWrapper(
    "user/admin/tracks/",
    {
      method: "GET",
    },
    options,
    true
  );
};

export const fetchTrack = (id: string): Promise<AdminTrack> => {
  return fetchWrapper(`user/admin/tracks/${id}`, {
    method: "GET",
  });
};

export const updateTrack = (
  id: number,
  data: AdminTrack
): Promise<AdminTrack> => {
  return fetchWrapper(`user/admin/tracks/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
