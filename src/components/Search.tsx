import { css } from "@emotion/css";
import React from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { bp, tags } from "../constants";
import { useGlobalStateContext } from "../contexts/globalState";
import { fetchUserArtistHistory } from "../services/api/User";
import Background from "./common/Background";
import IconButton from "./common/IconButton";
import InlineForm from "./common/InlineForm";
import Input from "./common/Input";
import Tags from "./common/Tags";

export const Search: React.FC = () => {
  const {
    state: { user },
  } = useGlobalStateContext();
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [expandSearch, setExpandSearch] = React.useState(false);
  const [artists, setArtists] = React.useState<
    { uid: number; meta_value: string }[]
  >([]);

  const onChange = React.useCallback((e) => {
    setSearch(e.target.value ?? "");
  }, []);

  const doSearch = React.useCallback(
    (search: string) => {
      const encodedURI = encodeURIComponent(search);
      navigate(`/library/search/?q=${encodedURI}`);
      setSearch("");
      setIsSearching(false);
      setExpandSearch(false);
    },
    [navigate]
  );

  const onSearchButtonClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      doSearch(search);
    },
    [doSearch, search]
  );

  const onFormSubmit = React.useCallback(
    (e) => {
      doSearch(search);
    },
    [search, doSearch]
  );

  const loadSuggestions = React.useCallback(async () => {
    if (user) {
      const artistResults = await fetchUserArtistHistory({ limit: 3 });
      setArtists(artistResults.data);
    }
  }, [user]);

  const onSmallScreenSearchButtonClick = () => {
    setExpandSearch(true);
  };

  React.useEffect(() => {
    if (isSearching) {
      loadSuggestions();
    }
  }, [loadSuggestions, isSearching]);

  const className = !expandSearch
    ? css`
        margin-right: 1rem;
        position: relative;
      `
    : css`
        position: absolute;
        background: white;
        padding: 0.5rem;
        left: 0;
        right: 0;
        > input {
          display: block !important;
          + button {
            display: block !important;
            background: white;
          }
        }

        @media (prefers-color-scheme: dark) {
          background: #333;
        }
      `;

  return (
    <>
      {isSearching && (
        <Background transparent onClick={() => setIsSearching(false)} />
      )}
      <IconButton
        onClick={onSmallScreenSearchButtonClick}
        type="button"
        className={css`
          @media (min-width: ${bp.small}px) {
            display: none;
          }
        `}
      >
        <FaSearch />
      </IconButton>
      {expandSearch && "yes"}
      <InlineForm compact className={className} onSubmit={onFormSubmit}>
        <Input
          placeholder="Search"
          name="search"
          value={search}
          onFocus={() => {
            setIsSearching(true);
          }}
          onChange={onChange}
          autoComplete="off"
          className={css`
            background-color: white;
            width: auto;
            @media (max-width: ${bp.small}px) {
              display: none;
            }
          `}
        />
        <IconButton
          onClick={onSearchButtonClick}
          type="submit"
          className={css`
            @media (max-width: ${bp.small}px) {
              display: none;
            }
          `}
        >
          <FaSearch />
        </IconButton>
        {isSearching && (
          <div
            className={css`
              position: absolute;
              top: 2.5rem;
              background-color: white;
              z-index: 999;
              width: auto;
              padding: 1rem;
              box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.1);
              animation: 100ms ease-out forwards slide-down;

              li > a {
                font-size: 0.9rem;
              }

              @media (max-width: ${bp.small}px) {
                width: 100%;
                left: 0;
              }
              @media (prefers-color-scheme: dark) {
                background-color: #333;
              }
            `}
          >
            {search === "" && <>Type something to start searching</>}
            {search !== "" && (
              <>Searching for: "{search}", press enter to search</>
            )}
            <div
              className={css`
                margin-top: 1rem;
              `}
            >
              <Tags
                onClick={() => {
                  setIsSearching(false);
                  setExpandSearch(false);
                }}
                tags={tags}
              />

              {artists.length > 0 && (
                <>
                  <h5>Listening history:</h5>
                  <ul
                    className={css`
                      margin-top: 0.25rem;
                      list-style: none;
                    `}
                  >
                    {artists.map((a) => (
                      <li key={a.uid}>
                        <a href={`/library/artist/${a.uid}`}>{a.meta_value}</a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        )}
      </InlineForm>
    </>
  );
};

export default Search;
