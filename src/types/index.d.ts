// We need to export here to show that it's a module
export {};

declare global {
  interface Window {
    darkMode?: {
      toggle: () => boolean;
      system: () => void;
    };
  }

  interface APIOptions {
    [key: string]: string | number | boolean | undefined;
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
    url?: string;
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

  interface LoggedInUser extends User {
    clientId: string;
    // credits: string;
    id: string;
    legacyId: number;
    displayName: string;
    email: string;
    ownedGroups: unknown[];
    newsletterNotification: boolean;
    role: {
      description: string;
      name: string;
    };
    credit: {
      total: number;
    };
    token: string;
    uid: number;
    isListenerMember: boolean;
    isMusicMember: boolean;
    memberships: {
      id: string;
      class: { name: string; id: number };
    }[];
  }

  interface User {
    id: number;
    displayName: string;
  }

  // FIXME: Suss out the relationship between trackgroups and playlists
  // and possibly define unique types for each. See search result types.
  type TrackgroupType = "playlist" | "ep" | "lp";

  interface Trackgroup {
    about: null | string;
    cover: string;
    cover_metadata: CoverMetadata;
    creatorId: string;
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
    enabled: boolean;
    release_date: string;
  }

  interface Playlist {
    about: null | string;
    cover: string;
    title: string;
    private: boolean;
    creatorId: string;
    feature: boolean;
    items: TrackGroupItem[];
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
    displayName: string;
    id: number;
    links?: {
      uri: string;
      platform: string;
    }[];
    images?: ArtistImage;
    bio: string;
    label?: { id: number; name: string };
    country: string;
    trackgroups?: TrackgroupDetail[];
  }

  interface User {
    displayName: string;
    id: string;
    country: string;
    userGroups?: UserGroup[];
  }

  interface UserGroup {
    displayName: string;
  }

  interface Track {
    id: string;
    creatorId: string;
    creator?: Partial<UserGroup>;
    trackGroup: Partial<Trackgroup>;
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

  interface IndexedTrack extends Track {
    index: number;
  }

  interface TrackWithUserCounts extends Track {
    favorite: boolean;
    plays: number;
  }

  interface TrackgroupItem {
    index: number;
    track: Track;
  }

  interface Release extends Trackgroup {
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
    creatorId: number;
    slug: string;
    cover: string;
    images: ImageSizes;
  }

  interface Favorite extends Track {}

  interface Label {
    name: string;
    id: number;
    links?: { uri: string; platform: string }[];
    images?: ArtistImage;
    bio: string;
    country: string;
  }

  interface LabelArtist {
    name: string;
    id: number;
    images: ArtistImage;
  }

  interface LabelAlbum {
    title: string;
    cover: string;
    duration: number;
    display_artist: string;
    creatorId: number;
    various: boolean;
    items: TrackgroupItem[];
  }

  interface SearchResultBase {
    tags: string[];
    _id: string;
    score: number;
  }

  interface TrackSearchResult extends SearchResultBase {
    track_id: string;
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
    kind: "artist" | "band";
    name: string;
    twitter_handle: string | null;
    images?: ArtistImage;
  }

  interface AlbumSearchResult extends SearchResultBase {
    creatorId: number;
    track_group_id: string;
    slug: string;
    kind: "album";
    title: string;
    images?: ImageSizes;
    display_artist: string;
    cover_metadata: CoverMetadata;
  }

  type SearchResult =
    | ArtistSearchResult
    | TrackSearchResult
    | LabelSearchResult
    | AlbumSearchResult;

  interface Stat {
    date: string;
    plays: number;
  }
}
