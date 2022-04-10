import { css } from "@emotion/css";
import React from "react";
import { Link } from "react-router-dom";
import { isTagResult, isTrack, isTrackgroup } from "../../typeguards";
import TrackPopup from "./TrackPopup";

export const SmallTileDetails: React.FC<{ object: Track | TagResult }> = ({
  object,
}) => {
  return (
    <>
      <div
        className={css`
          margin-left: 1rem;
          margin-top: 1rem;
        `}
      >
        <div
          className={css`
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
          `}
        >
          {object.title}
        </div>
        <div
          className={css`
            color: #444;
            font-size: 1rem;
          `}
        >
          <Link
            to={`/library/artist/${object.creator_id}`}
            className={css`
              color: inherit;
              text-decoration: none;
              transition: 0.25s color;
              &:hover {
                color: #111;
              }
            `}
          >
            {isTrack(object) && object.artist}
            {isTrackgroup(object) && object.display_artist}
          </Link>
        </div>
      </div>
      <div
        className={css`
          flex-grow: 1;
        `}
      />
      <div
        className={css`
          display: flex;
          align-items: center;
          margin-right: 1rem;
        `}
      >
        {isTrack(object) && <TrackPopup trackId={object.id} />}
        {isTagResult(object) && <TrackPopup groupId={object.track_group_id} />}
      </div>
    </>
  );
};

export default SmallTileDetails;
