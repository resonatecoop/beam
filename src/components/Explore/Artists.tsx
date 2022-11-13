import React from "react";
import { Link } from "react-router-dom";
import { fetchArtists } from "../../services/Api";
import usePagination from "../../utils/usePagination";
import GridListItem from "../common/GridListItem";
import ImageWithPlaceholder from "../common/ImageWithPlaceholder";
import LargeTileDetail from "../common/LargeTileDetail";
import { CenteredSpinner } from "../common/Spinner";

export const Artists: React.FC = () => {
  const { LoadingButton, results, isLoading } = usePagination<Artist>({
    apiCall: React.useCallback(fetchArtists, []),
    options: React.useMemo(
      () => ({ limit: 20, order: "desc", orderBy: "id" }),
      []
    ),
  });

  return (
    <>
      {isLoading && <CenteredSpinner />}
      <ul>
        {results.map((artist) => {
          return (
            <GridListItem key={artist.id} maxWidth={300}>
              <ImageWithPlaceholder
                src={artist.images?.["profile_photo-m"]}
                alt={artist.displayName}
                size={300}
              />
              <LargeTileDetail
                title={
                  <Link to={`/library/artist/${artist.id}`}>
                    {artist.displayName}
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
