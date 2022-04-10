import React from "react";
import { css } from "@emotion/css";
import { FaEllipsisV } from "react-icons/fa";
import IconButton from "./IconButton";
import Modal from "./Modal";
import ListButton from "./ListButton";
import { AddToPlaylist } from "../AddToPlaylist";
import { addTrackToUserFavorites, fetchTrackGroup } from "../../services/Api";

const TrackPopup: React.FC<{
  trackId?: number;
  groupId?: string;
  compact?: boolean;
}> = ({ trackId, groupId, compact }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [selectedTrackIds, setSelectedTrackIds] = React.useState<number[]>([]);
  const [isPlaylistPickerOpen, setIsPlaylistPickerOpen] = React.useState(false);

  const openMenu = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      setIsMenuOpen(true);
    },
    []
  );

  const openAddToPlaylist = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      setIsMenuOpen(false);
      setIsPlaylistPickerOpen(true);
    },
    []
  );

  const onSongAdded = React.useCallback(() => {
    setIsMenuOpen(false);
    setIsPlaylistPickerOpen(false);
  }, []);

  const determineTracks = React.useCallback(
    async (trackId?: number, groupId?: string) => {
      if (trackId) {
        setSelectedTrackIds([trackId]);
      } else if (groupId) {
        const result = await fetchTrackGroup(groupId);
        setSelectedTrackIds(result.items.map((item) => item.track.id));
      } else {
        throw new Error(
          "TrackPopup needs to include either trackId or groupId"
        );
      }
    },
    []
  );

  const onClickFavorite = React.useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      await Promise.all(
        selectedTrackIds.map((id) => addTrackToUserFavorites(id))
      );
    },
    [selectedTrackIds]
  );

  React.useEffect(() => {
    determineTracks(trackId, groupId);
  }, [trackId, groupId, determineTracks]);

  return (
    <>
      <div
        className={css`
          display: flex;
          align-items: center;
        `}
      >
        <IconButton onClick={(e) => openMenu(e)} compact={compact}>
          <FaEllipsisV />
        </IconButton>
      </div>

      {selectedTrackIds.length > 0 && (
        <Modal
          open={isPlaylistPickerOpen}
          onClose={() => setIsPlaylistPickerOpen(false)}
          size="small"
        >
          <AddToPlaylist
            selectedTrackIds={selectedTrackIds}
            onSongAdded={onSongAdded}
          />
        </Modal>
      )}

      {isMenuOpen && (
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
              <ListButton onClick={openAddToPlaylist}>
                Add to playlist
              </ListButton>
            </li>
            <li>
              <ListButton onClick={onClickFavorite}>Favorite</ListButton>
            </li>
          </ul>
        </Modal>
      )}
    </>
  );
};

export default TrackPopup;
