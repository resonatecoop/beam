import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { GlobalState, useGlobalStateContext } from "contexts/globalState";
import React from "react";
import AudioPlayer from "react-h5-audio-player";
import { ImLoop } from "react-icons/im";
import { getToken, registerPlay } from "../services/Api";

import { buildStreamURL } from "../utils/tracks";
import IconButton from "./common/IconButton";

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

export const AudioWrapper: React.FC<{
  currentTrack: TrackWithUserCounts | Track;
}> = ({ currentTrack }) => {
  const {
    state: { playerQueueIds, currentlyPlayingIndex, user, playing, looping },
    dispatch,
  } = useGlobalStateContext();

  const playerRef = React.useRef<any>();
  const [mostlyListened, setMostlyListened] = React.useState(false);

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
          const result = await registerPlay(user?.id, currentTrack.id);
          dispatch({ type: "setUserCredits", credits: result.total });
        } catch (e) {
          console.error(e);
        }
      }
    },
    [currentTrack, mostlyListened, user, dispatch]
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

  const getAudioSrc = React.useCallback(async () => {
    const streamUrl = buildStreamURL(currentTrack.id, user?.clientId);
    try {
      const { token } = getToken();
      const result = await fetch(streamUrl, {
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "audio/x-m4a; charset=utf-8",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const blob = await result.blob();
      if (blob) {
        playerRef.current.audio.current.src = URL.createObjectURL(blob);
      }
    } catch (e) {
      // If the result gets rejected here it's probably because of CORS,
      // so we'll just set the audio src directly.
      playerRef.current.audio.current.src = streamUrl;
    }
  }, [currentTrack, user]);

  React.useEffect(() => {
    getAudioSrc();
  }, [getAudioSrc]);

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
    <>
      <AudioPlayer
        ref={playerRef}
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
          }
        `}
      />
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
    </>
  );
};
