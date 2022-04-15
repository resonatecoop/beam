// We need to export here to show that it's a module
export {};

declare global {
  interface APIOptions {
    [key: string]: string | number;
  }

  interface APIPaginatedResult<T> {
    data: T[];
    pages?: number;
    numberOfPages?: number; // FIXME: this a shitty duplicate type of key situation from the api
    count: number;
  }

  interface ResonateImage {
    width: number;
    height: number;
    url: string;
  }

  interface CoverMetadata {
    id: string;
    owner_id: number;
  }

  interface ImageSizes {
    small?: ResonateImage;
    medium?: ResonateImage;
    large?: ResonateImage;
  }

  interface LoggedInUser {
    clientId: string;
    credits: string;
    id: number;
    legacyId: number;
    nickname: string;
    ownedGroups: unknown[];
    role: "listener";
    token: string;
    uid: number;
  }

  interface User {
    id: number;
    nicename: string;
  }

  // FIXME: Suss out the relationship between trackgroups and playlists
  // and possibly define unique types for each. See search result types.
  type TrackgroupType = "playlist" | "ep";

  interface Trackgroup {
    about: null | string;
    cover: string;
    cover_metadata: CoverMetadata;
    creator_id: number;
    display_artist: null | string;
    id: string;
    slug: string;
    tags: string[];
    title: string;
    type: TrackgroupType;
    user: User;
    uri: string;
    images: ImageSizes;
    private: boolean;
  }

  interface ArtistImage {
    "cover_photo-l": string;
    "cover_photo-s": string;
    "cover_photo-m": string;
    cover_photo: string;
    "profile_photo-xxl": string;
    "profile_photo-m": string;
    "profile_photo-l": string;
    "profile_photo-xs": string;
    "profile_photo-xl": string;
    "profile_photo-sm": string;
    profile_photo: string;
  }

  interface Artist {
    name: string;
    id: number;
    links: {
      href: string;
      text: string;
    }[];
    images?: ArtistImage;
    bio: string;
  }

  interface Track {
    id: number;
    creator_id: number;
    title: string;
    duration: number;
    album: string;
    cover: string;
    cover_metadata: CoverMetadata;
    artist: string;
    status: "Paid";
    url: string;
    images: ImageSizes;
  }

  interface TrackWithUserCounts extends Track {
    favorite: boolean;
    plays: number;
  }

  interface TrackgroupItem {
    index: number;
    track: Track;
  }

  interface ArtistRelease extends Trackgroup {
    items: TrackgroupItem[];
  }

  interface TrackgroupDetail extends Trackgroup {
    download: boolean;
    items: TrackgroupItem[];
    private: boolean;
    release_date: string;
  }

  interface TagResult {
    tags: string[];
    _id: string;
    track_group_id: string;
    display_artist: string;
    title: string;
    kind: "album";
    score: number;
    creator_id: number;
    slug: string;
    cover: string;
    images: ImageSizes;
  }

  interface Favorite extends Track {}

  interface SearchResultBase {
    tags: string[];
    _id: string;
    score: number;
  }

  interface TrackSearchResult extends SearchResultBase {
    track_id: number;
    kind: "track";
    display_artist: string;
    title: string;
    cover: string;
    images: ImageSizes;
  }

  interface LabelSearchResult extends SearchResultBase {
    user_id: number;
    kind: "label";
    name: string;
    twitter_handle: string;
    images?: ArtistImage;
  }

  interface ArtistSearchResult extends SearchResultBase {
    user_id: number;
    kind: "artist";
    name: string;
    twitter_handle: string;
    images?: ArtistImage;
  }
  type SearchResult =
    | ArtistSearchResult
    | TrackSearchResult
    | LabelSearchResult;
}
