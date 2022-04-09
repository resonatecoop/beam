import { css } from "@emotion/css";
import React from "react";
import { Link } from "react-router-dom";
import Table from "./Table";

export const TrackTable: React.FC<{ tracks: Track[] }> = ({ tracks }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Album</th>
          <th>Artist</th>
        </tr>
      </thead>
      <tbody>
        {tracks?.map((track) => (
          <tr key={track.id}>
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
              <Link to={`/library/artist/${track.creator_id}`}>
                {track.artist}
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TrackTable;
