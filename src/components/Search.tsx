import { css } from "@emotion/css";
import React from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import IconButton from "./common/IconButton";
import InlineForm from "./common/InlineForm";
import Input from "./common/Input";

export const Search: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");

  const onChange = React.useCallback((e) => {
    setSearch(e.target.value ?? "");
  }, []);

  const onSearchClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      navigate(`/library/search/${search}`);
    },
    [navigate, search]
  );

  return (
    <InlineForm
      compact
      className={css`
        margin-right: 1rem;
      `}
    >
      <Input
        placeholder="Search"
        name="search"
        value={search}
        onChange={onChange}
      />
      <IconButton onClick={onSearchClick}>
        <FaSearch />
      </IconButton>
    </InlineForm>
  );
};

export default Search;
