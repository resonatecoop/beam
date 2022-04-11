import { css } from "@emotion/css";
import React from "react";
import { Link, useParams } from "react-router-dom";
import constants from "../constants";
import { fetchSearchResults } from "../services/Api";
import { isArtistSearchResult, isTrackSearchResult } from "../typeguards";
import ClickToPlay from "./common/ClickToPlay";
import SmallTileDetails from "./common/SmallTileDetails";

export const SearchResults: React.FC = () => {
  const { searchString } = useParams();
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);

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
      <div>
        <ul
          className={css`
            list-style: none;
          `}
        >
          {searchResults.map((result) => (
            <li
              key={result._id}
              className={css`
                display: inline-flex;
                margin-right: 1rem;
                width: 45%;
                @media (max-width: ${constants.bp.medium}px) {
                  width: 100%;
                }
              `}
            >
              {isArtistSearchResult(result) && (
                <>
                  <img
                    src={result.images?.["profile_photo-sm"]}
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
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default SearchResults;
