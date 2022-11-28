import { css } from "@emotion/css";
import React from "react";
import { FaPlay } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useGlobalStateContext } from "../contexts/globalState";

import { fetchPlaylists } from "../services/Api";
import Button from "./common/Button";
import { CenteredSpinner } from "./common/Spinner";
import TrackList from "./common/TrackList";

const StaffPicks: React.FC = () => {
  const { dispatch } = useGlobalStateContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const { pathname } = useLocation();
  const editable = pathname.includes("library");
  const [latestStaffPick, setLatestStaffPick] = React.useState<Playlist>();
  const [tracks, setTracks] = React.useState<Track[]>();

  const fetchStaffPicksCallback = React.useCallback(async () => {
    setIsLoading(true);
    try {
      // const resp = await fetch(
      //   "https://raw.githubusercontent.com/simonv3/beam/main/featured.json"
      // );
      // const ids = (await resp.json()).playlists;
      const result = await fetchPlaylists({
        featured: true,
        limit: 1,
        random: true,
      });

      if (result.data.length > 0) {
        setLatestStaffPick(result.data[0]);

        setTracks(result?.data[0].items.map((item) => item.track));
      }
    } catch (e) {
      console.error("Staff picks loading error", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onPlayClick = React.useCallback(() => {
    if (tracks) {
      dispatch({
        type: "startPlayingIds",
        playerQueueIds: tracks?.map((track) => track.id) ?? [],
      });
    }
  }, [dispatch, tracks]);

  React.useEffect(() => {
    fetchStaffPicksCallback();
  }, [fetchStaffPicksCallback]);

  return (
    <div className={css``}>
      <div
        className={css`
          padding-bottom: 1rem;
        `}
      >
        <h3>Staff picks</h3>
        <p
          className={css`
            margin-bottom: 1rem;
          `}
        >
          Playlists by the people building Resonate showcasing some of their
          favorite music
        </p>
        {isLoading && <CenteredSpinner />}
        {latestStaffPick && (
          <div
            className={css`
              display: flex;
              align-items: center;

              > h4 {
                margin-bottom: 0;
                padding-bottom: 0;
                padding-right: 1rem;
              }
            `}
          >
            <h4>
              <Link to={`/library/playlist/${latestStaffPick.id}`}>
                {latestStaffPick.title}
              </Link>
            </h4>
            {tracks && (
              <Button
                compact
                startIcon={<FaPlay />}
                onClick={onPlayClick}
                data-cy="play-staff-picks"
              >
                Play
              </Button>
            )}
          </div>
        )}
        {latestStaffPick?.about}
      </div>

      {tracks && <TrackList tracks={tracks} draggable={editable} />}
    </div>
  );
};

export default StaffPicks;
