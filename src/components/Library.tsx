import { css } from "@emotion/css";
import React from "react";
import { PlaylistListing } from "./PlaylistListing";
import { Outlet, useNavigate } from "react-router-dom";
import BackButton from "./common/BackButton";

export const Library: React.FC = () => {
  const navigate = useNavigate();
  const onClick = (id: string) => {
    navigate(`/library/playlist/${id}`);
  };

  return (
    <>
      <div
        className={css`
          height: calc(100vh - 180px);
          position: fixed;
          width: 300px;
          z-index: 1;
          top: calc(48px + 3rem);
          left: 0;
          overflow-x: hidden;
          padding: 0 0 1rem 1rem;
        `}
      >
        <BackButton />

        <h2 className={css``}>Library</h2>

        <PlaylistListing onClick={onClick} />
      </div>
      <div
        className={css`
          margin-left: 320px;
          margin-top: 0.5rem;
        `}
      >
        <div
          className={css`
            position: relative;
            max-height: 100%;
          `}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Library;
