import { css } from "@emotion/css";
import React from "react";
import { fetchTracks } from "../../services/Api";
import usePagination from "../../utils/usePagination";
import { CenteredSpinner } from "../common/Spinner";
import TrackList from "../common/TrackList";

export const NowPlaying: React.FC = () => {
  const [tracks, setTracks] = React.useState<Track[]>([]);

  const { results, isLoading } = usePagination<Track>({
    apiCall: React.useCallback(fetchTracks, []),
    options: React.useMemo(() => ({ limit: 2, order: "plays" }), []),
  });

  React.useEffect(() => {
    setTracks(
      results.map((r) => ({
        ...r,
        images: {
          ...r.images,
          small: {
            // FIXME: There's a bug with the API's `images` being returned
            // from fetchTracks. The URLs seem to not point to any existing files.
            url: r.cover,
            width: 120,
            height: 120,
          },
        },
      }))
    );
  }, [results]);

  return (
    <>
      <h3>Now Playing</h3>
      <p
        className={css`
          margin-bottom: 1rem;
        `}
      >
        What's currently playing in the Resonate ecosystem?
      </p>
      {isLoading && <CenteredSpinner />}
      <TrackList tracks={tracks} />
    </>
  );
};

export default NowPlaying;
