import { css } from "@emotion/css";
import React from "react";
import Button from "../components/common/Button";
import { CenteredSpinner } from "../components/common/Spinner";

interface PaginationOptions extends APIOptions {
  limit: number;
}

/**
 * A helper that handles pagination
 * @param {
 *  apiCall: A call to the API that satisfies pagination,
 *  options. A *MEMOIZED* options array.
 * }
 * @returns
 */
export function usePagination<T>({
  apiCall,
  options,
}: {
  apiCall: (props: any) => Promise<APIPaginatedResult<T>>;
  options: PaginationOptions; // MUST BE MEMOIZED
}): {
  LoadingButton: () => React.ReactElement;
  results: T[];
  page: number;
  refresh: () => void;
  isLoading: boolean;
  loadMore: (currentPage: any) => Promise<void>;
} {
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(0);
  const [results, setResults] = React.useState<T[]>([]);
  const [isLoading, setLoading] = React.useState(false);
  const firstLoad = React.useRef(false);

  React.useEffect(() => {
    setResults([]);
  }, [options]);

  const loadMore = React.useCallback(
    async (currentPage: number, reset?: boolean) => {
      setLoading(true);

      const r = await apiCall({ ...options, page: currentPage });
      setPages(r.numberOfPages ?? r.pages ?? 0);
      setPage(currentPage);

      if (r.data) {
        setResults((existing) => [...(reset ? [] : existing), ...r.data]);
      }
      setLoading(false);
      firstLoad.current = true;
    },
    [apiCall, options]
  );

  React.useEffect(() => {
    loadMore(1);
  }, [loadMore]);

  const onClick = React.useCallback(() => {
    loadMore(page + 1);
  }, [loadMore, page]);

  const total = +options.limit * pages;
  const current = +options.limit * page;
  return {
    results,
    page,
    refresh: React.useCallback(() => {
      if (!firstLoad) {
        loadMore(1, true);
      }
    }, [loadMore]),
    loadMore,
    isLoading,
    LoadingButton: () => (
      <>
        {results.length > 0 && current <= total && (
          <>
            {isLoading && <CenteredSpinner />}
            {!isLoading && (
              <div
                className={css`
                  display: flex;
                  justify-content: center;
                  margin-top: 2rem;
                `}
              >
                <Button onClick={onClick}>load more</Button>
              </div>
            )}
          </>
        )}
      </>
    ),
  };
}

export default usePagination;
