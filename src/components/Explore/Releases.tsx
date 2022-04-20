import React from "react";
import { Link } from "react-router-dom";
import { fetchTrackGroups } from "../../services/Api";
import usePagination from "../../utils/usePagination";
import GridListItem from "../common/GridListItem";
import ImageWithPlaceholder from "../common/ImageWithPlaceholder";
import LargeTileDetail from "../common/LargeTileDetail";
import { CenteredSpinner } from "../common/Spinner";

export const Artists: React.FC = () => {
  const { LoadingButton, results, isLoading } = usePagination<Trackgroup>({
    apiCall: React.useCallback(fetchTrackGroups, []),
    options: React.useMemo(() => ({ limit: 50 }), []),
  });
  return (
    <>
      {isLoading && <CenteredSpinner />}
      <ul>
        {results.map((trackgroup) => {
          return (
            <GridListItem key={trackgroup.id} maxWidth={300}>
              <ImageWithPlaceholder
                src={trackgroup.images?.medium?.url}
                alt={trackgroup.title}
                size={300}
              />
              <LargeTileDetail
                title={
                  <Link to={`/library/artist/${trackgroup.id}`}>
                    {trackgroup.title}
                  </Link>
                }
              />
            </GridListItem>
          );
        })}
      </ul>
      <LoadingButton />
    </>
  );
};

export default Artists;
