import React from "react";
import { css } from "@emotion/css";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import { useGlobalStateContext } from "../contexts/globalState";
import { fetchTrack } from "../services/Api";
import { MdQueueMusic } from "react-icons/md";
import IconButton from "./common/IconButton";
import { useNavigate } from "react-router-dom";
import constants from "../constants";

const playerClass = css`
  min-height: 48px;
  border-bottom: 1px solid grey;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  position: fixed;
  width: 100%;
  z-index: 1;
  bottom: 0;
  background-color: #fff;

  @media (max-width: ${constants.bp.small}px) {
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

  @media (max-width: ${constants.bp.small}px) {
    width: 100%;
    align-items: flex-start;
    // justify-content: ;
  }
`;

const STREAM_API = "https://api.resonate.coop/v1/stream/";

const Player = () => {
  const {
    state: { playerQueueIds, user },
    dispatch,
  } = useGlobalStateContext();
  let navigate = useNavigate();

  const [currentTrack, setCurrentTrack] = React.useState<Track>();
  const [isPlaying, setIsPlaying] = React.useState(false);

  const fetchTrackCallback = React.useCallback(async (id: number) => {
    const track = await fetchTrack(id);
    setCurrentTrack(track);
  }, []);

  React.useEffect(() => {
    if (playerQueueIds && playerQueueIds[0]) {
      fetchTrackCallback(playerQueueIds[0]);
      setIsPlaying(true);
    }
  }, [fetchTrackCallback, playerQueueIds]);

  const onEnded = React.useCallback(() => {
    dispatch({ type: "popFromFrontOfQueue" });
  }, [dispatch]);

  const onClickQueue = React.useCallback(() => {
    navigate("/queue");
  }, [navigate]);

  if (playerQueueIds.length === 0 || !currentTrack) {
    return null;
  }

  return (
    <div className={playerClass}>
      <div className={trackInfo}>
        {/* FIXME currentTrack.images doesn't contain small image URL */}
        <img
          src={currentTrack.cover ?? currentTrack.images.small.url}
          height={50}
          width={50}
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
      </div>
      <div
        className={css`
          display: flex;
          align-items: center;
          flex-grow: 1;
          @media (max-width: ${constants.bp.small}px) {
            width: 100%;
          }
        `}
      >
        <IconButton
          onClick={onClickQueue}
          className={css`
            @media (max-width: ${constants.bp.small}px) {
              display: none;
            }
          `}
        >
          <MdQueueMusic />
        </IconButton>

        <AudioPlayer
          src={`${STREAM_API}${playerQueueIds[0]}${
            user ? `?client_id=${user?.clientId}` : ""
          }`}
          autoPlayAfterSrcChange
          onEnded={onEnded}
          layout="horizontal"
          className={css`
            &.rhap_container {
              box-shadow: none;
              padding: 0;
            }
          `}
        />
      </div>
    </div>
  );
};

export default Player;
