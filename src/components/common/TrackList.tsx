import React from "react";
import { css } from "@emotion/css";
import ClickToPlay from "./ClickToPlay";
import SmallTileDetails from "./SmallTileDetails";
import { Link } from "react-router-dom";
import TrackPopup from "./TrackPopup";

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
            {track.images.small && (
              <ClickToPlay
                trackId={track.id}
                title={track.title}
                image={track.images.small}
              />
            )}
            <SmallTileDetails
              title={track.title}
              subtitle={
                <Link to={`/library/artist/${track.creator_id}`}>
                  {track.artist}
                </Link>
              }
              moreActions={<TrackPopup trackId={track.id} />}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default TrackList;
