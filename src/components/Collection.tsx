import { css } from "@emotion/css";
import React from "react";
import { fetchUserCollection } from "../services/api/User";
import usePagination from "../utils/usePagination";
import TrackTable from "./common/TrackTable";

export const Collection: React.FC = () => {
  const { LoadingButton, results } = usePagination<Track>({
    apiCall: React.useCallback(fetchUserCollection, []),
    options: React.useMemo(() => ({ limit: 50 }), []),
  });

  return (
    <div
      className={css`
        flex-grow: 1;
      `}
    >
      <h3>Collection</h3>
      {results.length > 0 && <TrackTable tracks={results} />}
      <LoadingButton />
    </div>
  );
};

export default Collection;
