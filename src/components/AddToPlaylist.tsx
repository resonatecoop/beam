import React from "react";

import { css } from "@emotion/css";
import { bp } from "../constants";
import { addTracksToTrackGroup, fetchUserTrackGroups } from "../services/Api";
import AddPlaylist from "./AddPlaylist";
import ListButton, { listButtonClass } from "./common/ListButton";
import { FaCheck } from "react-icons/fa";

export const AddToPlaylist: React.FC<{
  selectedTrackIds: number[];
  onSongAdded: () => void;
}> = ({ selectedTrackIds, onSongAdded }) => {
  const [playlists, setPlaylists] = React.useState<TrackgroupDetail[]>();

  const fetchPlaylistsCallback = React.useCallback(async () => {
    const result = await fetchUserTrackGroups({ type: "playlist" });
    setPlaylists(result);
  }, []);

  React.useEffect(() => {
    fetchPlaylistsCallback();
  }, [fetchPlaylistsCallback]);

  const onClick = React.useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      playlistId: string
    ) => {
      e.stopPropagation();
      await addTracksToTrackGroup(playlistId, {
        tracks: selectedTrackIds.map((id) => ({ track_id: id })),
      });
      onSongAdded();
    },
    [selectedTrackIds, onSongAdded]
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
      <AddPlaylist />
      <ul
        className={css`
          list-style: none;
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
                className={listButtonClass}
                onClick={(e) => onClick(e, playlist.id)}
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
