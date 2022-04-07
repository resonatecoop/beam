import React from "react";
import { css } from "@emotion/css";
import ClickToPlay from "./ClickToPlay";

const staffPickUl = css``;

const staffPickLi = css`
  display: flex;
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
    <ul className={staffPickUl}>
      {localTracks.map((track) => (
        <li key={track.key} className={staffPickLi}>
          <ClickToPlay
            trackId={track.id}
            title={track.title}
            image={track.images.small}
          />
          <div className="track-info">
            <div>{track.title}</div>
            <div>{track.artist}</div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TrackList;
