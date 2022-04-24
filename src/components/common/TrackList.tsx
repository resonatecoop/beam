import React from "react";
import { css } from "@emotion/css";
import ClickToPlay from "./ClickToPlay";
import SmallTileDetails from "./SmallTileDetails";
import { Link } from "react-router-dom";
import TrackPopup from "./TrackPopup";
import ResultListItem from "./ResultListItem";
import useDraggableTrack from "utils/useDraggableTrack";

const staffPickUl = css``;

interface TrackWithKey extends Track {
  key: string;
}

const TrackList: React.FC<{
  tracks: Track[];
  draggable?: boolean;
  fullWidth?: boolean;
  handleDrop?: (ev: React.DragEvent<HTMLLIElement>) => void;
}> = ({ tracks, draggable, fullWidth, handleDrop }) => {
  const localTracks = tracks.map((track, index) => ({
    ...track,
    key: `${track.id} + ${index}`,
  }));

  return (
    <>
      <ul className={staffPickUl}>
        {localTracks.map((track) => (
          <TrackLIWrapper
            track={track}
            key={track.key}
            handleDrop={handleDrop}
            draggable={draggable}
            fullWidth={fullWidth}
          />
        ))}
      </ul>
    </>
  );
};

const TrackLIWrapper: React.FC<{
  track: TrackWithKey;
  handleDrop?: (ev: React.DragEvent<HTMLLIElement>) => void;
  draggable?: boolean;
  fullWidth?: boolean;
}> = ({ track, draggable, fullWidth, handleDrop }) => {
  const { onDragStart, onDragEnd } = useDraggableTrack();

  const [isHoveringOver, setIsHoveringOver] = React.useState(false);

  const onDragEnter = () => {
    setIsHoveringOver(true);
  };

  const onDragLeave = () => {
    setIsHoveringOver(false);
  };
  return (
    <ResultListItem
      draggable={draggable}
      onDragOver={(ev) => ev.preventDefault()}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      fullWidth={fullWidth}
      id={`${track.id}`}
      onDropCapture={handleDrop}
      className={
        isHoveringOver
          ? css`
              background-color: #f8f8f8;
              & * {
                pointer-events: none;
              }
            `
          : ""
      }
    >
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
          <Link to={`/library/artist/${track.creator_id}`}>{track.artist}</Link>
        }
        moreActions={<TrackPopup trackId={track.id} />}
      />
    </ResultListItem>
  );
};

export default TrackList;
