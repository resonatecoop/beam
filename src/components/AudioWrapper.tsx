import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { GlobalState, useGlobalStateContext } from "contexts/globalState";
import React from "react";
import AudioPlayer from "react-h5-audio-player";
import ReactHlsPlayer from "@gumlet/react-hls-player";
import { ImLoop } from "react-icons/im";
import { getToken } from "services/Api";
import { registerPlay } from "../services/api/User";

import { buildHLSURL, buildStreamURL, getCORSSong } from "../utils/tracks";
import IconButton from "./common/IconButton";
import { FaBackward, FaForward, FaPause, FaPlay } from "react-icons/fa";
import H5AudioPlayer from "react-h5-audio-player";

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

function isEqualDurations(n1: number, n2: number) {
  return Math.abs(n1 - n2) < 0.00001;
}
function fmtMSS(s: number) {
  return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
}

const hlsConfig = {
  xhrSetup: function (xhr: XMLHttpRequest, url: string) {
    const { token } = getToken();
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
  },
};

export const AudioWrapper: React.FC<{
  currentTrack: TrackWithUserCounts | Track;
}> = ({ currentTrack }) => {
  const {
    state: { playerQueueIds, currentlyPlayingIndex, user, playing, looping },
    dispatch,
  } = useGlobalStateContext();
  const [currentTime, setCurrentTime] = React.useState("0:00");
  const legacyPlayerRef = React.useRef<H5AudioPlayer>(null);
  const playerRef = React.useRef<HTMLVideoElement>(null);

  const [mostlyListened, setMostlyListened] = React.useState(false);
  const userId = user?.id;

  const onEnded = React.useCallback(async () => {
    if (!mostlyListened && currentTrack && userId) {
      try {
        await registerPlay(currentTrack.id);
      } catch (e) {
        console.error(e);
      }
    }
    if (looping === "loopTrack") {
      playerRef.current?.play();
    } else {
      dispatch({ type: "incrementCurrentlyPlayingIndex" });
    }
    setMostlyListened(false);
  }, [currentTrack, dispatch, looping, mostlyListened, userId]);

  const onListen = React.useCallback(
    async (e) => {
      setCurrentTime(fmtMSS(e.target.currentTime.toFixed()));
      if (
        !mostlyListened &&
        currentTrack &&
        userId &&
        e.target.currentTime > 45
      ) {
        setMostlyListened(true);
        try {
          const result = await registerPlay(currentTrack.id);
          dispatch({ type: "setUserCredits", credits: result.total });
        } catch (e) {
          console.error(e);
        }
      }
    },
    [currentTrack, mostlyListened, userId, dispatch]
  );

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

  const getAudioSrc = React.useCallback(async () => {
    const streamUrl = buildStreamURL(currentTrack.id, !!userId);
    try {
      const blob = await getCORSSong(streamUrl);
      if (blob && legacyPlayerRef.current?.audio.current) {
        legacyPlayerRef.current.audio.current.src = URL.createObjectURL(blob);
      }
    } catch (e) {
      // If the result gets rejected here it's probably because of CORS,
      // so we'll just set the audio src directly.
      if (legacyPlayerRef.current?.audio.current) {
        legacyPlayerRef.current.audio.current.src = streamUrl;
      }
    }
  }, [currentTrack.id, userId]);

  React.useEffect(() => {
    getAudioSrc();
  }, [getAudioSrc]);

  const determineIfShouldPlay = React.useCallback(() => {
    if (
      currentTrack &&
      currentlyPlayingIndex !== undefined &&
      currentTrack.id === playerQueueIds[currentlyPlayingIndex] &&
      playing
    ) {
      if (playerRef?.current) {
        playerRef.current.play();
      } else if (
        legacyPlayerRef.current &&
        !legacyPlayerRef.current.isPlaying()
      ) {
        legacyPlayerRef.current.audio.current?.play();
      }
    } else if (playerRef?.current && playing === false) {
      if (playerRef?.current) {
        playerRef.current.pause();
      } else if (
        legacyPlayerRef.current &&
        legacyPlayerRef.current.isPlaying()
      ) {
        legacyPlayerRef.current.audio.current?.pause();
      }
    }
  }, [currentTrack, currentlyPlayingIndex, playerQueueIds, playing]);

  React.useEffect(() => {
    determineIfShouldPlay();
  }, [determineIfShouldPlay]);

  const onLoop = React.useCallback(() => {
    let nextLooping: GlobalState["looping"] = undefined;
    if (looping === undefined) {
      nextLooping = "loopTrack";
      if (legacyPlayerRef.current?.audio.current) {
        legacyPlayerRef.current.audio.current.loop = true;
      }
    } else if (looping === "loopTrack") {
      nextLooping = "loopQueue";
    }
    dispatch({ type: "setLooping", looping: nextLooping });
  }, [dispatch, looping]);

  const streamUrl = buildHLSURL(currentTrack.id, !!userId);
  const duration = playerRef.current?.duration ?? 0;
  const currentSeconds = playerRef.current?.currentTime ?? 0;
  const percent = currentSeconds / duration;

  return (
    <>
      {currentTrack.hls && (
        <>
          <IconButton onClick={onClickPrevious}>
            <FaBackward />
          </IconButton>
          {!playing && (
            <IconButton onClick={onPlay}>
              <FaPlay />
            </IconButton>
          )}
          {playing && (
            <IconButton onClick={onPause}>
              <FaPause />
            </IconButton>
          )}
          <IconButton onClick={onClickNext}>
            <FaForward />
          </IconButton>
          <ReactHlsPlayer
            src={streamUrl}
            autoPlay={false}
            style={{ display: "none" }}
            // controls={true}
            // @ts-ignore
            hlsConfig={hlsConfig}
            width="100%"
            height="2rem"
            onPlay={onPlay}
            onEnded={onEnded}
            playerRef={playerRef}
            onTimeUpdate={onListen}
          />
          <div
            className={css`
              height: 0.5rem;
              width: 100%;
              margin-left: 1rem;
              border-radius: 1rem;
              margin-right: 1rem;
              background: rgba(0, 0, 0, 0.6);
            `}
          >
            <div
              className={css`
                height: 100%;
                overflow: none;
                border-radius: 1rem;
                transition: 1s width;
                width: ${percent * 100}%;
                background: rgba(0, 0, 0, 0.2);
              `}
            ></div>
          </div>
        </>
      )}
      {currentTrack.hls && currentTime}
      {!currentTrack.hls && (
        <AudioPlayer
          ref={legacyPlayerRef}
          onEnded={onEnded}
          onPause={onPause}
          onPlay={onPlay}
          onClickNext={onClickNext}
          onClickPrevious={onClickPrevious}
          customAdditionalControls={[]}
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
              @media (prefers-color-scheme: dark) {
                filter: invert(82.5%);
              }
              @media (prefers-color-scheme: light) {
                background: #fff;
              }
            }
          `}
        />
      )}
      <IconButton
        color={looping ? "primary" : undefined}
        compact
        onClick={onLoop}
        className={css`
          margin-left: 1rem;
          margin-right: 1rem;
          position: relative;
        `}
      >
        <ImLoop />
        {looping === "loopTrack" && <LoopingIndicator>1</LoopingIndicator>}
      </IconButton>
    </>
  );
};
