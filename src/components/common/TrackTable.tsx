import { css } from "@emotion/css";
import React from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGlobalStateContext } from "../../contexts/globalState";
import IconButton from "./IconButton";
import Table from "./Table";
import TrackPopup from "./TrackPopup";

export const TrackTable: React.FC<{ tracks: Track[] }> = ({ tracks }) => {
  const {
    state: { playerQueueIds },
    dispatch,
  } = useGlobalStateContext();

  const currentTrackId = playerQueueIds[0];

  const onTrackClick = React.useCallback(
    (id: number) => {
      const idx = tracks.findIndex((track) => track.id === id);
      dispatch({
        type: "addTrackIdsToFrontOfQueue",
        idsToAdd: tracks.slice(idx, tracks.length).map((track) => track.id),
      });
    },
    [dispatch, tracks]
  );

  return (
    <Table style={{ marginBottom: "2rem" }}>
      <thead>
        <tr>
          <th />
          <th>Title</th>
          <th>Album</th>
          <th>Artist</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {tracks?.map((track) => (
          <tr
            key={track.id}
            onClick={() => onTrackClick(track.id)}
            className={css`
              > td > .play-button {
                opacity: 0;
              }
              &:hover > td > .play-button {
                opacity: 1;
              }
            `}
          >
            <td>
              {currentTrackId !== track.id && (
                <IconButton compact className="play-button">
                  <FaPlay />
                </IconButton>
              )}
              {currentTrackId === track.id && (
                <IconButton compact>
                  <FaPause />
                </IconButton>
              )}
            </td>
            <td
              className={css`
                width: 40%;
                overflow: hidden;
                whitespace: nowrap;
                text-overflow: ellipsis;
              `}
            >
              {track.title}
            </td>
            <td
              className={css`
                width: 40%;
                overflow: hidden;
                whitespace: nowrap;
                text-overflow: ellipsis;
              `}
            >
              {track.album}
            </td>
            <td
              className={css`
                width: 20%;
                overflow: hidden;
                whitespace: nowrap;
                text-overflow: ellipsis;
              `}
            >
              <Link
                onClick={(e) => {
                  e.stopPropagation();
                }}
                to={`/library/artist/${track.creator_id}`}
              >
                {track.artist}
              </Link>
            </td>
            <td>
              <TrackPopup trackId={track.id} compact />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TrackTable;
