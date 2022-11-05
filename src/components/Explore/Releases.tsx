import ClickToPlay from "components/common/ClickToPlay";
import React from "react";
import { Link } from "react-router-dom";
import { fetchTrackGroups } from "../../services/Api";
import usePagination from "../../utils/usePagination";
import GridListItem from "../common/GridListItem";
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
              <ClickToPlay
                image={{
                  ...trackgroup.images?.medium,
                  width: 300,
                  height: 300,
                }}
                title={trackgroup.title}
                groupId={trackgroup.id}
                trackGroupType="trackgroup"
              />
              <LargeTileDetail
                title={
                  <Link to={`/library/trackgroup/${trackgroup.id}`}>
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
