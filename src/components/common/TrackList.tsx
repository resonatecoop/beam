import React from "react";
import { css } from "@emotion/css";
import ClickToPlay from "./ClickToPlay";
import SmallTileDetails from "./SmallTileDetails";
import { Link } from "react-router-dom";
import TrackPopup from "./TrackPopup";
import ResultListItem from "./ResultListItem";

const staffPickUl = css``;

const TrackList: React.FC<{ tracks: Track[] }> = ({ tracks }) => {
  const localTracks = tracks.map((track, index) => ({
    ...track,
    key: `${track.id} + ${index}`,
  }));

  return (
    <>
      <ul className={staffPickUl}>
        {localTracks.map((track) => (
          <ResultListItem key={track.key}>
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
          </ResultListItem>
        ))}
      </ul>
    </>
  );
};

export default TrackList;
