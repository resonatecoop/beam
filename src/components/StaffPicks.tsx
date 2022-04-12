import { css } from "@emotion/css";
import React from "react";

import { fetchTrackGroup, fetchUserPlaylists } from "../services/Api";
import TrackList from "./common/TrackList";

const StaffPicks: React.FC = () => {
  const [latestStaffPick, setLatestStaffPick] = React.useState<Trackgroup>();
  const [tracks, setTracks] = React.useState<Track[]>();

  const fetchStaffPicksCallback = React.useCallback(async () => {
    const result = await fetchUserPlaylists(12788, { limit: 1 });
    setLatestStaffPick(result[0]);

    const tracklisting = await fetchTrackGroup(result[0].id);
    setTracks(tracklisting?.items.map((item) => item.track));
  }, []);

  React.useEffect(() => {
    fetchStaffPicksCallback();
  }, [fetchStaffPicksCallback]);

  if (!latestStaffPick) {
    return null;
  }

  return (
    <div className={css``}>
      <div
        className={css`
          padding-bottom: 1rem;
        `}
      >
        <h3>Staff picks</h3>
        <h4>{latestStaffPick.title}</h4>
        {latestStaffPick.about}
      </div>

      {tracks && <TrackList tracks={tracks} />}
    </div>
  );
};

export default StaffPicks;
