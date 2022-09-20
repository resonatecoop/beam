import { fetchWrapper } from "services/Api";

export interface AdminUser {
  country: string;
  displayName: string;
  email: string;
  emailConfirmed: boolean;
  fullName: string;
  id: string;
  member: string;
  role: { name: string; description: string };
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

export interface AdminTrackGroup {
  id: string;
  title: string;
  type: string;
  about: string;
  private: boolean;
  enabled: boolean;
  display_artist: string;
  composers: string[];
  performers: string[];
  release_date: string;
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

export interface AdminTrack {
  id: number;
  title: string;
  album: string;
  album_artist: string;
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
