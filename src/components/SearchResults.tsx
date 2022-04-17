import { css } from "@emotion/css";
import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchSearchResults } from "../services/Api";
import {
  isArtistSearchResult,
  isLabelSearchResult,
  isTrackSearchResult,
} from "../typeguards";
import ClickToPlay from "./common/ClickToPlay";
import EmptyBox from "./common/EmptyBox";
import ResultListItem from "./common/ResultListItem";
import SmallTileDetails from "./common/SmallTileDetails";

export const SearchResults: React.FC = () => {
  const [search] = useSearchParams();
  const searchString = search.get("q");
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);

  const fetchSearchResultsCallback = React.useCallback(async (str: string) => {
    const results = await fetchSearchResults(str);
    setSearchResults(results ?? []);
  }, []);

  React.useEffect(() => {
    fetchSearchResultsCallback(searchString ?? "");
  }, [searchString, fetchSearchResultsCallback]);

  return (
    <>
      <h3>Results for "{searchString}"</h3>
      <div>
        <ul
          className={css`
            list-style: none;
          `}
        >
          {searchResults.length === 0 && (
            <EmptyBox>No results found, try another search!</EmptyBox>
          )}
          {searchResults.map((result) => (
            <ResultListItem>
              {(isArtistSearchResult(result) ||
                isLabelSearchResult(result)) && (
                <>
                  <img
                    src={result.images?.["profile_photo-sm"]}
                    className={css`
                      background-color: #ddd;
                    `}
                    width={120}
                    height={120}
                    alt={result.name}
                  />
                  <SmallTileDetails
                    title={
                      <Link to={`/library/artist/${result.user_id}`}>
                        {result.name}
                      </Link>
                    }
                    subtitle={""}
                  />
                </>
              )}

              {isTrackSearchResult(result) && (
                <>
                  {result.images.small && (
                    <ClickToPlay
                      title={result.title}
                      image={result.images.small}
                    />
                  )}
                  <SmallTileDetails
                    title={
                      <Link to={`/library/artist/${result.track_id}`}>
                        {result.title}
                      </Link>
                    }
                    subtitle={result.display_artist}
                  />
                </>
              )}
            </ResultListItem>
          ))}
        </ul>
      </div>
    </>
  );
};

export default SearchResults;
