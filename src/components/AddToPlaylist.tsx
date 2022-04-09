import React from "react";

import { css } from "@emotion/css";
import constants from "../constants";
import { addTracksToTrackGroup, fetchUserTrackGroups } from "../services/Api";
import AddPlaylist from "./AddPlaylist";
import ListButton, { listButtonClass } from "./common/ListButton";

export const AddToPlaylist: React.FC<{ selectedTrackId: number }> = ({
  selectedTrackId,
}) => {
  const [playlists, setPlaylists] = React.useState<TrackgroupDetail[]>();

  const fetchPlaylistsCallback = React.useCallback(async () => {
    const result = await fetchUserTrackGroups({ type: "playlist" });

    setPlaylists(result);
  }, []);

  React.useEffect(() => {
    fetchPlaylistsCallback();
  }, [fetchPlaylistsCallback]);

  const onClick = React.useCallback(
    async (playlistId: string) => {
      await addTracksToTrackGroup(playlistId, {
        tracks: [{ track_id: selectedTrackId }],
      });
    },
    [selectedTrackId]
  );

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        max-width: 300px;
        margin-right: 1rem;
        padding: 1rem 0;
        @media (max-width: ${constants.bp.small}px) {
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
        {playlists?.map((playlist) => (
          <li
            key={playlist.id}
            className={css`
              &:nth-child(odd) {
                background-color: #dfdfdf;
              }
            `}
          >
            <ListButton
              className={listButtonClass}
              onClick={() => onClick(playlist.id)}
            >
              {playlist.title}
            </ListButton>
          </li>
        ))}
      </ul>
    </div>
  );
};
