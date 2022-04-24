import { css } from "@emotion/css";
import React from "react";
import { fetchLatestTracks } from "../../services/Api";
import usePagination from "../../utils/usePagination";
import Select from "../common/Select";
import { CenteredSpinner } from "../common/Spinner";
import TrackList from "../common/TrackList";

export const Tracks: React.FC = () => {
  const [order, setOrder] = React.useState("newest");
  const { LoadingButton, results, isLoading } = usePagination<Track>({
    apiCall: React.useCallback(fetchLatestTracks, []),
    options: React.useMemo(() => ({ limit: 50, order }), [order]),
  });

  const onChangeOrder: React.ChangeEventHandler<HTMLSelectElement> =
    React.useCallback((e) => {
      setOrder(e.target.value);
    }, []);

  return (
    <>
      <div
        className={css`
          display: flex;
          justify-content: flex-end;
          margin-bottom: 1rem;
          align-items: center;

          > div {
            margin-right: 1rem;
          }
        `}
      >
        <div>sort by: </div>
        <Select
          value={order}
          onChange={onChangeOrder}
          options={[
            { label: "Latest", value: "newest" },
            { label: "Random", value: "random" },
            // { label: "Oldest", value: "oldest" },
            { label: "Currently playing", value: "plays" },
          ]}
        />
      </div>
      {isLoading && <CenteredSpinner />}

      <TrackList
        tracks={results.map((r) => ({
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
        }))}
      />
      <LoadingButton />
    </>
  );
};

export default Tracks;
