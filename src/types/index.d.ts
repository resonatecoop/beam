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
    emailConfirmed: false;
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
    about: string;
    cover: string;
    cover_metadata: CoverMetadata;
    creatorId: string;
    creator: Partial<UserGroup>;
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
    featured: boolean;
    releaseDate: string;
  }

  interface Playlist {
    about: null | string;
    cover: string;
    title: string;
    private: boolean;
    creatorId: string;
    feature: boolean;
    items: TrackGroupItem[];
    id: string;
    tags: string[];
    images: ImageSizes;
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
    id: string;
    banner?: {
      small: string;
      medium: string;
      large: string;
    };
    avatar?: {
      xxs: string;
      xs: string;
      s: string;
      m: string;
      l: string;
      xl: string;
      xxl: string;
      xxxl: string;
    };
    links?: {
      uri: string;
      platform: string;
    }[];
    images?: ArtistImage;
    shortBio: string;
    description: string;
    email: string;
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

  // FIXME: consolidate this with Artist
  interface UserGroup {
    id: string;
    displayName: string;
    images?: ArtistImage;
    shortBio: string;
    links?: {
      uri: string;
      platform: string;
    }[];
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

  interface Label extends UserGroup {}

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

  interface Stat {
    date: string;
    count: number;
  }
}
