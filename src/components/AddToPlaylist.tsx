import React from "react";

import { css } from "@emotion/css";
import { bp } from "../constants";
import { addTracksToTrackGroup, fetchUserTrackGroups } from "../services/Api";
import AddPlaylist from "./AddPlaylist";
import ListButton from "./common/ListButton";
import { FaCheck } from "react-icons/fa";
import { useSnackbar } from "contexts/SnackbarContext";

export const AddToPlaylist: React.FC<{
  selectedTrackIds: number[];
  onSongAdded: () => void;
}> = ({ selectedTrackIds, onSongAdded }) => {
  const [playlists, setPlaylists] = React.useState<TrackgroupDetail[]>();
  const snackbar = useSnackbar();

  const fetchPlaylistsCallback = React.useCallback(
    async (id?: string) => {
      const result = await fetchUserTrackGroups({ type: "playlist" });
      setPlaylists(result);
      if (id) {
        await addTracksToTrackGroup(id, {
          tracks: selectedTrackIds.map((id) => ({ track_id: id })),
        });
        onSongAdded();
      }
    },
    [onSongAdded, selectedTrackIds]
  );

  React.useEffect(() => {
    fetchPlaylistsCallback();
  }, [fetchPlaylistsCallback]);

  const onClick = React.useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      playlistId: string,
      playlistName: string
    ) => {
      e.stopPropagation();
      await addTracksToTrackGroup(playlistId, {
        tracks: selectedTrackIds.map((id) => ({ track_id: id })),
      });
      onSongAdded();
      snackbar(`Added song to "${playlistName}"`, { type: "success" });
    },
    [selectedTrackIds, onSongAdded, snackbar]
  );

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-right: 1rem;
        padding: 1rem 0;
        @media (max-width: ${bp.small}px) {
          max-width: inherit;
        }
      `}
    >
      <AddPlaylist refresh={fetchPlaylistsCallback} />
      <ul
        className={css`
          list-style: none;
          overflow-x: scroll;
          max-height: 30vh;
        `}
      >
        {playlists?.map((playlist) => {
          const alreadyOnPlaylist = playlist.items.find((item) => {
            return selectedTrackIds.indexOf(item.track.id) !== -1;
          });
          return (
            <li
              key={playlist.id}
              className={css`
                &:nth-of-type(odd) {
                  background-color: #dfdfdf;
                }
              `}
            >
              <ListButton
                onClick={(e) => onClick(e, playlist.id, playlist.title)}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                {playlist.title}
                {alreadyOnPlaylist && <FaCheck />}
              </ListButton>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
