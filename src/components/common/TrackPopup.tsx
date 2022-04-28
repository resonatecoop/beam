import React from "react";
import { css } from "@emotion/css";
import { FaCode, FaEllipsisV, FaFont, FaMinus, FaPlus } from "react-icons/fa";
import IconButton from "./IconButton";
import Modal from "./Modal";
import ListButton, { NavLinkAsButton } from "./ListButton";
import { AddToPlaylist } from "../AddToPlaylist";
import {
  addTrackToUserFavorites,
  fetchTrack,
  fetchTrackGroup,
  removeTracksFromTrackGroup,
} from "../../services/Api";
import { mapFavoriteAndPlaysToTracks } from "../../utils/tracks";
import { SpinningStar } from "./FavoriteTrack";
import { CenteredSpinner } from "./Spinner";
import TrackPopupDetails from "./TrackPopupDetails";
import SharePopUp from "./SharePopUp";
import { useGlobalStateContext } from "../../contexts/globalState";

const TrackPopup: React.FC<{
  trackId?: number;
  groupId?: string;
  compact?: boolean;
  reload?: () => Promise<void>;
}> = ({ trackId, groupId, compact, reload }) => {
  const {
    state: { user },
  } = useGlobalStateContext();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [artistId, setArtistId] = React.useState<number>();
  const [trackgroup, setTrackgroup] = React.useState<Trackgroup>();
  const [isLoadingFavorite, setIsLoadingFavorite] = React.useState(false);
  const [track, setTrack] = React.useState<TrackWithUserCounts>();
  const [selectedTrackIds, setSelectedTrackIds] = React.useState<number[]>([]);
  const [isPlaylistPickerOpen, setIsPlaylistPickerOpen] = React.useState(false);
  const [isShareOpen, setIsShareOpen] = React.useState(false);

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

  const removeFromPlaylist = React.useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      if (user && groupId && trackId) {
        await removeTracksFromTrackGroup(groupId, {
          tracks: [{ track_id: trackId }],
        });
        if (reload) {
          reload();
        }
      }
      setIsMenuOpen(false);
    },
    [user, groupId, reload, trackId]
  );

  const openShare = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      setIsMenuOpen(false);
      setIsShareOpen(true);
    },
    []
  );

  const onSongAdded = React.useCallback(() => {
    setIsMenuOpen(false);
    setIsPlaylistPickerOpen(false);
  }, []);

  const determineTracks = React.useCallback(
    async (trackId?: number, groupId?: string) => {
      let trackIds = [];
      if (trackId) {
        trackIds.push(trackId);
        const t = await fetchTrack(trackId);
        const mapped = await mapFavoriteAndPlaysToTracks([t]);
        setTrack(mapped[0]);
        setIsFavorite(mapped[0]?.favorite ?? 0);
        setArtistId(t.creator_id);
      } else if (groupId) {
        const result = await fetchTrackGroup(groupId);
        setArtistId(result.creator_id);
        setTrackgroup(result);
        trackIds.push(...result.items.map((item) => item.track.id));
      } else {
        throw new Error(
          "TrackPopup needs to include either trackId or groupId"
        );
      }

      setSelectedTrackIds(trackIds);
    },
    []
  );

  const onClickFavorite = React.useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      setIsLoadingFavorite(true);
      await Promise.all(
        selectedTrackIds.map((id) => addTrackToUserFavorites(id))
      );
      setIsFavorite((val) => !val);
      setIsLoadingFavorite(false);
    },
    [selectedTrackIds]
  );

  React.useEffect(() => {
    if (isMenuOpen) {
      determineTracks(trackId, groupId);
    }
  }, [trackId, groupId, determineTracks, isMenuOpen]);

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

      <SharePopUp
        open={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        track={track}
        trackgroup={trackgroup}
      />

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
          {trackId && !track && <CenteredSpinner />}
          {track && <TrackPopupDetails track={track} />}
          <ul
            className={css`
              list-style: none;
            `}
          >
            {track && (
              <li>
                <ListButton onClick={onClickFavorite}>
                  <SpinningStar
                    spinning={isLoadingFavorite}
                    full={isFavorite}
                  />
                  {isFavorite ? "Remove from favorites" : "Add to favorites"}
                </ListButton>
              </li>
            )}
            <li>
              <ListButton onClick={openShare}>
                <FaCode /> Share &amp; embed
              </ListButton>
            </li>
            <li>
              <ListButton onClick={openAddToPlaylist}>
                <FaPlus /> Add to playlist
              </ListButton>
            </li>
            {trackId && groupId && (
              <li>
                <ListButton onClick={removeFromPlaylist}>
                  <FaMinus /> Remove from playlist
                </ListButton>
              </li>
            )}
            {artistId && (
              <li>
                <NavLinkAsButton to={`/library/artist/${artistId}`}>
                  <FaFont />
                  Artist page
                </NavLinkAsButton>
              </li>
            )}
          </ul>
        </Modal>
      )}
    </>
  );
};

export default TrackPopup;
