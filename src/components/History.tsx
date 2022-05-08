import { css } from "@emotion/css";
import React from "react";
import { useGlobalStateContext } from "../contexts/globalState";
import { fetchUserHistory } from "../services/Api";
import usePagination from "../utils/usePagination";
import TrackTable from "./common/TrackTable";

export const History: React.FC = () => {
  const {
    state: { playerQueueIds },
  } = useGlobalStateContext();
  const { LoadingButton, results, refresh, isLoading } = usePagination<Track>({
    apiCall: React.useCallback(fetchUserHistory, []),
    options: React.useMemo(() => ({ limit: 50 }), []),
  });

  React.useEffect(() => {
    refresh();
  }, [isLoading, playerQueueIds, refresh]);

  return (
    <div
      className={css`
        flex-grow: 1;
      `}
    >
      <h3>History</h3>
      {results.length > 0 && <TrackTable tracks={results} />}
      <LoadingButton />
    </div>
  );
};

export default History;
