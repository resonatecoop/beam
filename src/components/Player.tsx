import React from "react";
import { css } from "@emotion/css";
import "react-h5-audio-player/lib/styles.css";
import { Helmet } from "react-helmet";

import { useGlobalStateContext } from "../contexts/globalState";
import { fetchTrack } from "../services/Api";
import { MdQueueMusic } from "react-icons/md";
import { ImShuffle } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import { bp } from "../constants";
import { FavoriteTrack } from "./common/FavoriteTrack";
import { mapFavoriteAndPlaysToTracks } from "../utils/tracks";
import Button from "./common/Button";
import { isTrackWithUserCounts } from "../typeguards";
import ImageWithPlaceholder from "./common/ImageWithPlaceholder";
import IconButton from "./common/IconButton";
import { AudioWrapper } from "./AudioWrapper";
import Spinner from "./common/Spinner";
import TrackPopup from "./common/TrackPopup";

const playerClass = css`
  min-height: 48px;
  border-bottom: 1px solid grey;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  position: fixed;
  width: 100%;
  z-index: 10;
  bottom: 0;
  filter: drop-shadow(0 0 0.02rem #000);

  @media (prefers-color-scheme: dark) {
    background: #333;
  }

  @media (prefers-color-scheme: light) {
    background: #fff;
  }

  @media (max-width: ${bp.small}px) {
    height: 150px;
    flex-direction: column;
  }
`;

const trackInfo = css`
  display: flex;
  align-items: center;
  flex-grow: 1;
  margin-right: 0.5rem;

  @media (max-width: ${bp.small}px) {
    width: 100%;
    align-items: flex-start;
  }
`;

const Player = () => {
  const {
    state: { playerQueueIds, currentlyPlayingIndex, user, shuffle },
    dispatch,
  } = useGlobalStateContext();
  let navigate = useNavigate();
  const [currentTrack, setCurrentTrack] = React.useState<
    TrackWithUserCounts | Track
  >();
  const [isLoading, setIsLoading] = React.useState(false);
  const userId = user?.id;

  const fetchTrackCallback = React.useCallback(
    async (id: number) => {
      setIsLoading(true);
      const track = await fetchTrack(id);
      if (userId) {
        const mappedTrack = (await mapFavoriteAndPlaysToTracks([track]))[0];
        setCurrentTrack(mappedTrack);
      } else {
        setCurrentTrack(track);
      }

      setIsLoading(false);
    },
    [userId]
  );

  const currentTrackId = currentTrack?.id;
  const playerQueueIdAtIndex =
    currentlyPlayingIndex !== undefined &&
    playerQueueIds?.[currentlyPlayingIndex];

  const playerQueueIdsLength = playerQueueIds.length;

  // FIXME: Something is causing this to trigger twice and
  // call the above callback twice.
  React.useEffect(() => {
    if (playerQueueIdsLength && playerQueueIdAtIndex) {
      if (currentTrackId !== playerQueueIdAtIndex) {
        setCurrentTrack(undefined);
        fetchTrackCallback(playerQueueIdAtIndex);
      }
    } else {
      setCurrentTrack(undefined);
    }
  }, [
    fetchTrackCallback,
    playerQueueIdsLength,
    playerQueueIdAtIndex,
    currentTrackId,
  ]);

  const onClickQueue = React.useCallback(() => {
    navigate("/library/queue");
  }, [navigate]);

  const onShuffle = React.useCallback(() => {
    dispatch({ type: "setShuffle", shuffle: !shuffle });
  }, [dispatch, shuffle]);

  React.useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        dispatch({ type: "incrementCurrentlyPlayingIndex" });
      });
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        dispatch({ type: "decrementCurrentlyPlayingIndex" });
      });
    }
  }, [dispatch]);

  React.useEffect(() => {
    if (currentTrack) {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentTrack.title,
          artist: currentTrack.artist,
          album: currentTrack.album ?? "",
          artwork: [
            {
              src: currentTrack.images.small?.url ?? currentTrack.cover ?? "",
              sizes: `${currentTrack.images.small?.height}x${currentTrack.images.small?.height}`,
              type: "image/png",
            },
          ],
        });
      }
    }
  }, [currentTrack]);

  return (
    <div className={playerClass}>
      <Helmet>
        {currentTrack && (
          <title>
            {currentTrack.artist} - {currentTrack.title}
          </title>
        )}
      </Helmet>
      {currentTrack && (
        <div className={trackInfo}>
          <ImageWithPlaceholder
            src={currentTrack.images.small?.url ?? currentTrack.cover}
            size={50}
            alt={currentTrack.title}
            className={css`
              background-color: #efefef;
              margin-right: 0.5rem;
            `}
          />
          <div>
            <div>{currentTrack.title}</div>
            <div>{currentTrack.album}</div>
            <div>
              <Link to={`/library/artist/${currentTrack.creatorId}`}>
                {currentTrack.artist}
              </Link>
            </div>
          </div>
          {isTrackWithUserCounts(currentTrack) && user && (
            <div
              className={css`
                flex-grow: 1;
                text-align: right;
                padding-right: 1rem;
              `}
            >
              <FavoriteTrack track={currentTrack} />
            </div>
          )}
          <TrackPopup trackId={currentTrack.id} compact />
        </div>
      )}
      {!currentTrack && isLoading && <Spinner size="small" />}
      {!currentTrack && !isLoading && (
        <div className={trackInfo}>
          Current queue is empty, click on something to play!
        </div>
      )}
      <div
        className={css`
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex-grow: 1;
          @media (max-width: ${bp.small}px) {
            width: 100%;
          }
        `}
      >
        {currentTrack && <AudioWrapper currentTrack={currentTrack} />}
        <IconButton
          color={shuffle ? "primary" : undefined}
          compact
          onClick={onShuffle}
        >
          <ImShuffle />
        </IconButton>

        <Button
          onClick={onClickQueue}
          compact
          data-cy="queue"
          variant="outlined"
          className={css`
            margin-left: 2rem;
            @media (max-width: ${bp.small}px) {
              display: none;
            }
          `}
          startIcon={<MdQueueMusic style={{}} />}
        >
          Queue
        </Button>
      </div>
    </div>
  );
};

export default Player;
