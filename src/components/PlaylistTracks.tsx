import { css } from "@emotion/css";
import React from "react";
import { useParams } from "react-router-dom";
import { fetchTrack, fetchUserTrackGroup } from "../services/Api";
import { CenteredSpinner } from "./common/Spinner";
import Table from "./common/Table";

export const PlaylistTracks: React.FC = () => {
  let { playlistId } = useParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [tracks, setTracks] = React.useState<Track[]>();

  const fetchTracks = React.useCallback(async (playlistId: string) => {
    setIsLoading(true);

    const playlist = await fetchUserTrackGroup(playlistId);
    const trackIds = playlist.items.map((item) => item.track.id);
    const results = await Promise.all(
      trackIds.map((id) => {
        return fetchTrack(id);
      })
    );
    setIsLoading(false);
    setTracks(results);
  }, []);

  React.useEffect(() => {
    if (playlistId) {
      fetchTracks(playlistId);
    }
  }, [fetchTracks, playlistId]);

  return (
    <div
      className={css`
        flex-grow: 1;
      `}
    >
      <h3>Tracks</h3>
      {isLoading && <CenteredSpinner />}
      {!isLoading && (
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
                <td>{track.title}</td>
                <td>{track.album}</td>
                <td>{track.artist}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default PlaylistTracks;
