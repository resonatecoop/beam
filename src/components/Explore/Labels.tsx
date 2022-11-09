import React from "react";
import { Link } from "react-router-dom";
import { fetchLabels } from "../../services/Api";
import usePagination from "../../utils/usePagination";
import GridListItem from "../common/GridListItem";
import ImageWithPlaceholder from "../common/ImageWithPlaceholder";
import LargeTileDetail from "../common/LargeTileDetail";
import { CenteredSpinner } from "../common/Spinner";

export const Labels: React.FC = () => {
  const { LoadingButton, results, isLoading } = usePagination<Label>({
    apiCall: React.useCallback(fetchLabels, []),
    options: React.useMemo(() => ({ limit: 20 }), []),
  });
  return (
    <>
      {isLoading && <CenteredSpinner />}

      <ul>
        {results.map((label) => {
          return (
            <GridListItem key={label.id} maxWidth={300}>
              <ImageWithPlaceholder
                src={label.images?.["profile_photo-m"]}
                alt={label.name}
                size={300}
              />
              <LargeTileDetail
                title={
                  <Link to={`/library/label/${label.id}`}>{label.name}</Link>
                }
                subtitle={label.country}
              />
            </GridListItem>
          );
        })}
      </ul>
      <LoadingButton />
    </>
  );
};

export default Labels;
