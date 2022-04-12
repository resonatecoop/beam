import { css } from "@emotion/css";
import React from "react";
import Button from "./Button";
import { CenteredSpinner } from "./Spinner";

export const usePagination = ({
  callbackFnc,
}: {
  callbackFnc: (nextPage: number) => Promise<void>;
}) => {
  const [page, setPage] = React.useState(1);
  const [isLoading, setLoading] = React.useState(false);

  const loadMore = React.useCallback(
    async (currentPage) => {
      setLoading(true);
      await callbackFnc(currentPage + 1);
      setPage((p) => p + 1);
      setLoading(false);
    },
    [callbackFnc]
  );

  return {
    LoadingButton: () => (
      <>
        {isLoading && <CenteredSpinner />}
        {
          <div
            className={css`
              display: flex;
              justify-content: center;
              margin-top: 2rem;
            `}
          >
            <Button onClick={() => loadMore(page)}>load more</Button>
          </div>
        }
      </>
    ),
  };
};

export default usePagination;
