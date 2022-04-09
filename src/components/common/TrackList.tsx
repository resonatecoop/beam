import React from "react";
import { css } from "@emotion/css";
import ClickToPlay from "./ClickToPlay";
import TrackPopup from "./TrackPopup";
import { Link } from "react-router-dom";

const staffPickUl = css``;

const staffPickLi = css`
  display: flex;
  position: relative;
  margin-bottom: 1rem;

  .track-info {
    margin-left: 1rem;
  }
`;

const TrackList: React.FC<{ tracks: Track[] }> = ({ tracks }) => {
  const localTracks = tracks.map((track, index) => ({
    ...track,
    key: `${track.id} + ${index}`,
  }));

  return (
    <>
      <ul className={staffPickUl}>
        {localTracks.map((track) => (
          <li key={track.key} className={staffPickLi}>
            <ClickToPlay
              trackId={track.id}
              title={track.title}
              image={track.images.small}
            />
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
                {track.title}
              </div>
              <div
                className={css`
                  color: #444;
                  font-size: 1rem;
                `}
              >
                <Link
                  to={`/library/artist/${track.creator_id}`}
                  className={css`
                    color: inherit;
                    text-decoration: none;
                    transition: 0.25s color;
                    &:hover {
                      color: #111;
                    }
                  `}
                >
                  {track.artist}
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
              <TrackPopup trackId={track.id} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TrackList;
