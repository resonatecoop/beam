import { css } from "@emotion/css";
import React from "react";
import { Link } from "react-router-dom";
import { useGlobalStateContext } from "../../contexts/globalState";
import IconButton from "./IconButton";
import Table from "./Table";
import TrackPopup from "./TrackPopup";

export const TrackTable: React.FC<{ tracks: Track[] }> = ({ tracks }) => {
  const { dispatch } = useGlobalStateContext();

  const onTrackClick = React.useCallback(
    (id: number) => {
      dispatch({ type: "addTrackIdsToFrontOfQueue", idsToAdd: [id] });
    },
    [dispatch]
  );
  return (
    <Table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Album</th>
          <th>Artist</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {tracks?.map((track) => (
          <tr key={track.id} onClick={() => onTrackClick(track.id)}>
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
