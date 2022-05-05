import React from "react";
import { css } from "@emotion/css";
import "react-h5-audio-player/lib/styles.css";

import { useGlobalStateContext } from "../contexts/globalState";
import { fetchTrack } from "../services/Api";
import { MdQueueMusic } from "react-icons/md";
import { ImShuffle } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { bp } from "../constants";
import { FavoriteTrack } from "./common/FavoriteTrack";
import { mapFavoriteAndPlaysToTracks } from "../utils/tracks";
import Button from "./common/Button";
import { isTrackWithUserCounts } from "../typeguards";
import ImageWithPlaceholder from "./common/ImageWithPlaceholder";
import IconButton from "./common/IconButton";
import { AudioWrapper } from "./AudioWrapper";

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
  background-color: #fff;

  @media (max-width: ${bp.small}px) {
    height: 150px;
    flex-direction: column;
  }
`;

const trackInfo = css`
  display: flex;
  align-items: center;
  flex-grow: 1;

  img {
    margin-right: 1rem;
  }

  @media (max-width: ${bp.small}px) {
    width: 100%;
    align-items: flex-start;
    // justify-content: ;
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

  const fetchTrackCallback = React.useCallback(
    async (id: number) => {
      const track = await fetchTrack(id);
      if (user) {
        const mappedTrack = (await mapFavoriteAndPlaysToTracks([track]))[0];
        setCurrentTrack(mappedTrack);
      } else {
        setCurrentTrack(track);
      }
    },
    [user]
  );

  React.useEffect(() => {
    if (
      playerQueueIds &&
      currentlyPlayingIndex !== undefined &&
      playerQueueIds[currentlyPlayingIndex]
    ) {
      fetchTrackCallback(playerQueueIds[currentlyPlayingIndex]);
    } else {
      setCurrentTrack(undefined);
    }
  }, [fetchTrackCallback, playerQueueIds, currentlyPlayingIndex]);

  const onClickQueue = React.useCallback(() => {
    navigate("/library/queue");
  }, [navigate]);

  const onShuffle = React.useCallback(() => {
    dispatch({ type: "setShuffle", shuffle: !shuffle });
  }, [dispatch, shuffle]);

  return (
    <div className={playerClass}>
      {currentTrack && (
        <div className={trackInfo}>
          <ImageWithPlaceholder
            src={currentTrack.images.small?.url ?? currentTrack.cover}
            size={50}
            alt={currentTrack.title}
            className={css`
              background-color: #efefef;
            `}
          />
          <div>
            <div>{currentTrack.title}</div>
            <div>{currentTrack.album}</div>
            <div>{currentTrack.artist}</div>
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
        </div>
      )}
      {!currentTrack && (
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
