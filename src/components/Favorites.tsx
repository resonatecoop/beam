import { css } from "@emotion/css";
import React from "react";
import { fetchUserFavorites } from "../services/Api";
import { CenteredSpinner } from "./common/Spinner";
import TrackTable from "./common/TrackTable";

export const Favorites: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [tracks, setTracks] = React.useState<Track[]>();

  const fetchTracks = React.useCallback(async () => {
    setIsLoading(true);
    const results = await fetchUserFavorites();

    setIsLoading(false);
    setTracks(results);
  }, []);

  React.useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  return (
    <div
      className={css`
        flex-grow: 1;
      `}
    >
      <h3>Favorites</h3>
      {isLoading && <CenteredSpinner />}
      {!isLoading && tracks && <TrackTable tracks={tracks} />}
    </div>
  );
};

export default Favorites;
