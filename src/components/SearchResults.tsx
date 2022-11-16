import { css } from "@emotion/css";
import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchSearchResults } from "../services/Api";
import {
  isAlbumSearchResult,
  isArtistSearchResult,
  isLabelSearchResult,
  isTrackSearchResult,
} from "../typeguards";
import ClickToPlay from "./common/ClickToPlay";
import EmptyBox from "./common/EmptyBox";
import GridListItem from "./common/GridListItem";
import ImageWithPlaceholder from "./common/ImageWithPlaceholder";
import LargeTileDetail from "./common/LargeTileDetail";
import ResultListItem from "./common/ResultListItem";
import SmallTileDetails from "./common/SmallTileDetails";

export const SearchResults: React.FC = () => {
  const [search] = useSearchParams();
  const searchString = search.get("q");
  const [searchResults, setSearchResults] = React.useState<{
    artists: Artist[];
    trackgroups: Trackgroup[];
  }>();

  const fetchSearchResultsCallback = React.useCallback(async (str: string) => {
    const results = await fetchSearchResults(str);
    setSearchResults(results);
  }, []);

  React.useEffect(() => {
    fetchSearchResultsCallback(searchString ?? "");
  }, [searchString, fetchSearchResultsCallback]);

  return (
    <>
      <h3>Results for "{searchString}"</h3>
      {searchResults && (
        <>
          <div>
            <h3>Artists</h3>
            <ul
              className={css`
                list-style: none;
              `}
            >
              {searchResults.artists.map((artist) => (
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
              ))}
            </ul>
          </div>
          <div>
            <h3>Releases</h3>
            <ul
              className={css`
                list-style: none;
              `}
            >
              {searchResults.trackgroups.map((trackgroup) => (
                <GridListItem key={trackgroup.id} maxWidth={300}>
                  <ImageWithPlaceholder
                    src={trackgroup.cover}
                    alt={trackgroup.title}
                    size={300}
                  />
                  <LargeTileDetail
                    title={
                      <Link to={`/library/trackgroup/${trackgroup.id}`}>
                        {trackgroup.title}
                      </Link>
                    }
                  />
                </GridListItem>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default SearchResults;
