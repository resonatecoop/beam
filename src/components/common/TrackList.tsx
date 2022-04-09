import React from "react";
import { css } from "@emotion/css";
import ClickToPlay from "./ClickToPlay";
import { FaEllipsisV } from "react-icons/fa";
import IconButton from "./IconButton";
import Modal from "./Modal";
import ListButton from "./ListButton";
import { AddToPlaylist } from "../AddToPlaylist";

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
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [selectedTrackId, setSelectedTrackId] = React.useState<number>();
  const [isPlaylistPickerOpen, setIsPlaylistPickerOpen] = React.useState(false);
  const localTracks = tracks.map((track, index) => ({
    ...track,
    key: `${track.id} + ${index}`,
  }));

  const openMenu = React.useCallback((id: number) => {
    setIsMenuOpen(true);
    setSelectedTrackId(id);
  }, []);

  const openAddToPlaylist = React.useCallback(() => {
    setIsMenuOpen(false);
    setIsPlaylistPickerOpen(true);
  }, []);

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
                `}
              >
                {track.title}
              </div>
              <div
                className={css`
                  color: #333;
                  font-size: 1rem;
                `}
              >
                {track.artist}
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
              <IconButton onClick={() => openMenu(track.id)}>
                <FaEllipsisV />
              </IconButton>
            </div>
          </li>
        ))}
      </ul>
      {selectedTrackId && (
        <Modal
          open={isPlaylistPickerOpen}
          onClose={() => setIsPlaylistPickerOpen(false)}
          size="small"
        >
          <AddToPlaylist selectedTrackId={selectedTrackId} />
        </Modal>
      )}

      <Modal
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        size="small"
      >
        <ul
          className={css`
            list-style: none;
          `}
        >
          <li>
            <ListButton onClick={openAddToPlaylist}>Add to playlist</ListButton>
          </li>
        </ul>
      </Modal>
    </>
  );
};

export default TrackList;
