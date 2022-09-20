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
import ImageWithPlaceholder from "./common/ImageWithPlaceholder";
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
        {searchResults.length === 0 && (
          <EmptyBox>No results found, try another search!</EmptyBox>
        )}
        <ul
          className={css`
            list-style: none;
          `}
        >
          {searchResults.map((result) => (
            <ResultListItem>
              {(isArtistSearchResult(result) ||
                isLabelSearchResult(result)) && (
                <>
                  <ImageWithPlaceholder
                    src={result.images?.["profile_photo-sm"]}
                    className={css`
                      background-color: #ddd;
                    `}
                    size={120}
                    alt={result.name}
                  />
                  <SmallTileDetails
                    title={
                      <Link
                        to={`/library/${
                          result.kind === "label" ? "label" : "artist"
                        }/${result.user_id}`}
                      >
                        {result.kind}: {result.name}
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
                      trackId={result.track_id}
                    />
                  )}
                  <SmallTileDetails
                    title={`Track: ${result.title}`}
                    subtitle={result.display_artist}
                  />
                </>
              )}
              {isAlbumSearchResult(result) && (
                <>
                  {result.images?.small && (
                    <ClickToPlay
                      title={result.title}
                      image={result.images.small}
                      groupId={result.track_group_id}
                    />
                  )}
                  <SmallTileDetails
                    title={
                      <Link to={`/library/trackgroup/${result.track_group_id}`}>
                        {result.kind}: {result.title}
                      </Link>
                    }
                    subtitle={
                      <>
                        by:{" "}
                        <Link to={`/library/artist/${result.creatorId}`}>
                          {result.display_artist}
                        </Link>
                      </>
                    }
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
