import React from "react";
import { css } from "@emotion/css";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import { GlobalState, useGlobalStateContext } from "../contexts/globalState";
import { fetchTrack, registerPlay } from "../services/Api";
import { MdQueueMusic } from "react-icons/md";
import { ImLoop, ImShuffle } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { bp } from "../constants";
import { FavoriteTrack } from "./common/FavoriteTrack";
import { buildStreamURL, mapFavoriteAndPlaysToTracks } from "../utils/tracks";
import Button from "./common/Button";
import { isTrackWithUserCounts } from "../typeguards";
import ImageWithPlaceholder from "./common/ImageWithPlaceholder";
import IconButton from "./common/IconButton";
import styled from "@emotion/styled";

const LoopingIndicator = styled.span`
  position: absolute;
  font-size: 0.5rem;
  padding: 0.15rem 0.2rem;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 100%;
  color: white;
  top: -0.25rem;
  right: -0.25rem;
`;

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

function isEqualDurations(n1: number, n2: number) {
  return Math.abs(n1 - n2) < 0.00001;
}

const Player = () => {
  const {
    state: {
      playerQueueIds,
      currentlyPlayingIndex,
      user,
      playing,
      shuffle,
      looping,
    },
    dispatch,
  } = useGlobalStateContext();
  let navigate = useNavigate();
  const playerRef = React.useRef<any>();
  const [currentTrack, setCurrentTrack] = React.useState<
    TrackWithUserCounts | Track
  >();
  const [mostlyListened, setMostlyListened] = React.useState(false);

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

  const onEnded = React.useCallback(async () => {
    if (!mostlyListened && currentTrack && user) {
      try {
        await registerPlay(user?.id, currentTrack.id);
      } catch (e) {
        console.error(e);
      }
    }
    if (looping === "loopTrack") {
    } else {
      dispatch({ type: "incrementCurrentlyPlayingIndex" });
    }
    setMostlyListened(false);
  }, [currentTrack, dispatch, looping, mostlyListened, user]);

  const onClickQueue = React.useCallback(() => {
    navigate("/library/queue");
  }, [navigate]);

  const onListen = React.useCallback(
    async (e) => {
      if (
        !mostlyListened &&
        currentTrack &&
        user &&
        e.target.currentTime > 45
      ) {
        setMostlyListened(true);
        try {
          // FIXME: the v1 API doesn't allow play registration from localhost:8080
          await registerPlay(user?.id, currentTrack.id);
        } catch (e) {
          console.error(e);
        }
      }
    },
    [currentTrack, mostlyListened, user]
  );

  const determineIfShouldPlay = React.useCallback(() => {
    if (
      currentTrack &&
      currentlyPlayingIndex !== undefined &&
      currentTrack.id === playerQueueIds[currentlyPlayingIndex] &&
      playerRef?.current &&
      playing &&
      !playerRef.current.isPlaying()
    ) {
      playerRef.current.audio.current.play();
    } else if (
      playerRef?.current &&
      playing === false &&
      playerRef.current.isPlaying()
    ) {
      playerRef.current.audio.current.pause();
    }
  }, [currentTrack, currentlyPlayingIndex, playerQueueIds, playing]);

  React.useEffect(() => {
    determineIfShouldPlay();
  }, [determineIfShouldPlay]);

  const onClickNext = React.useCallback(() => {
    dispatch({ type: "incrementCurrentlyPlayingIndex" });
  }, [dispatch]);

  const onClickPrevious = React.useCallback(() => {
    dispatch({ type: "decrementCurrentlyPlayingIndex" });
  }, [dispatch]);

  const onPause = React.useCallback(
    (e) => {
      // onPause gets triggered both onEnded and onPause, so we need
      // a way to differntiate those.
      if (!isEqualDurations(e.target.currentTime, e.target.duration)) {
        dispatch({ type: "setPlaying", playing: false });
      }
    },
    [dispatch]
  );

  const onPlay = React.useCallback(() => {
    dispatch({ type: "setPlaying", playing: true });
  }, [dispatch]);

  const onShuffle = React.useCallback(() => {
    dispatch({ type: "setShuffle", shuffle: !shuffle });
  }, [dispatch, shuffle]);

  const onLoop = React.useCallback(() => {
    playerRef.current.audio.current.loop = false;
    let nextLooping: GlobalState["looping"] = undefined;
    if (looping === undefined) {
      nextLooping = "loopTrack";
      playerRef.current.audio.current.loop = true;
    } else if (looping === "loopTrack") {
      nextLooping = "loopQueue";
    }
    dispatch({ type: "setLooping", looping: nextLooping });
  }, [dispatch, looping]);

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
        {currentTrack && (
          <AudioPlayer
            src={buildStreamURL(currentTrack.id, user?.clientId)}
            ref={playerRef}
            onEnded={onEnded}
            onPause={onPause}
            onPlay={onPlay}
            onClickNext={onClickNext}
            onClickPrevious={onClickPrevious}
            showSkipControls
            onListen={onListen}
            onLoadedData={determineIfShouldPlay}
            showJumpControls={false}
            layout="horizontal"
            className={css`
              &.rhap_container {
                box-shadow: none;
                padding: 0;
                margin-right: 1rem;
              }
            `}
          />
        )}
        <IconButton
          color={shuffle ? "primary" : undefined}
          compact
          onClick={onShuffle}
        >
          <ImShuffle />
        </IconButton>
        <IconButton
          color={looping ? "primary" : undefined}
          compact
          onClick={onLoop}
          className={css`
            margin-left: 1rem;
            position: relative;
          `}
        >
          <ImLoop />
          {looping === "loopTrack" && <LoopingIndicator>1</LoopingIndicator>}
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
