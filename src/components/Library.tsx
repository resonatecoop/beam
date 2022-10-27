import { css } from "@emotion/css";
import React from "react";
import { PlaylistListing } from "./PlaylistListing";
import { Outlet } from "react-router-dom";
import BackButton from "./common/BackButton";
import { useGlobalStateContext } from "contexts/globalState";

export const Library: React.FC = () => {
  const {
    state: { user },
  } = useGlobalStateContext();

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

        {user && <PlaylistListing />}
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
