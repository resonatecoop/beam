import styled from "@emotion/styled";
import SnackbarContext from "contexts/SnackbarContext";
import React from "react";

import { FaPause, FaPlay } from "react-icons/fa";
import { MdQueue } from "react-icons/md";
import { bp } from "../../constants";

import { useGlobalStateContext } from "../../contexts/globalState";
import { fetchTrackGroup } from "../../services/Api";
import Button from "./Button";
import ImageWithPlaceholder from "./ImageWithPlaceholder";
import { PlayingMusicBars } from "./PlayingMusicBars";

type WrapperProps = {
  width: number;
  height: number;
};

const PlayWrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: column;
  position: absolute;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  top: 0;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  border: 0;
  transition: 0.5s;

  button {
    color: white;
    background-color: transparent;
    font-size: 1rem;

    &:nth-child(1) {
      margin-bottom: 0.5rem;
    }

    &:hover:not(:disabled) {
      background-color: rgba(0, 0, 0, 0.5);
    }
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 1;
  }

  @media (max-width: ${bp.medium}px) {
    width: 100%;
    opacity: 1;
    bottom: 0;
    top: auto;
    height: 100%;
    position: absolute;

    button {
      font-size: 0.8rem;
      border: 1px solid white;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
`;

const Wrapper = styled.div<WrapperProps>`
  position: relative;
  max-width: 100%;

  @media (max-width: ${bp.medium}px) {
    position: relative;

    img {
      width: ${(props) => (props.width < 420 ? `${props.width}px` : "100%")};
      height: ${(props) => (props.height < 420 ? `${props.height}px` : "auto")};
    }
  }
`;

const ClickToPlay: React.FC<{
  groupId?: string;
  trackId?: number;
  title: string;
  image: ResonateImage;
  className?: string;
}> = ({ groupId, title, image, trackId, className }) => {
  const {
    state: { playing, playerQueueIds },
    dispatch,
  } = useGlobalStateContext();
  const { displayMessage } = React.useContext(SnackbarContext);

  const onClickPlay = React.useCallback(async () => {
    let ids: number[] = [];
    if (groupId) {
      const result = await fetchTrackGroup(groupId);
      ids = result.items.map((item) => item.track.id);
    } else if (trackId) {
      if (playerQueueIds.includes(trackId)) {
        const indexOfTrack = playerQueueIds.indexOf(trackId);
        const newTracks = playerQueueIds.slice(indexOfTrack);
        ids = [...newTracks];
      } else {
        ids = [trackId];
      }
    }
    dispatch({
      type: "setValuesDirectly",
      values: { playing: true, playerQueueIds: ids },
    });
  }, [dispatch, groupId, trackId, playerQueueIds]);

  const onClickQueue = React.useCallback(async () => {
    if (groupId) {
      await fetchTrackGroup(groupId).then((result) => {
        dispatch({
          type: "addTrackIdsToBackOfQueue",
          idsToAdd: result.items.map((item) => item.track.id),
        });
      });
    } else if (trackId) {
      dispatch({
        type: "addTrackIdsToBackOfQueue",
        idsToAdd: [trackId],
      });
    }
    displayMessage("Added to queue");
  }, [dispatch, groupId, trackId, displayMessage]);

  const onPause = React.useCallback(async () => {
    dispatch({ type: "setPlaying", playing: false });
  }, [dispatch]);

  const currentlyPlaying = playing && playerQueueIds[0] === trackId;

  return (
    <Wrapper
      width={image?.width ?? 0}
      height={image?.height ?? 0}
      className={className}
    >
      <PlayWrapper width={image?.width ?? 0} height={image?.height ?? 0}>
        {!currentlyPlaying && (
          <Button onClick={onClickPlay} startIcon={<FaPlay />} compact>
            Play
          </Button>
        )}
        {currentlyPlaying && (
          <Button onClick={onPause} startIcon={<FaPause />} compact>
            Pause
          </Button>
        )}
        <Button onClick={onClickQueue} startIcon={<MdQueue />} compact>
          Queue
        </Button>
      </PlayWrapper>
      {currentlyPlaying && (
        <PlayingMusicBars
          width={image?.width ?? 0}
          height={image?.height ?? 0}
        />
      )}

      {image && (
        <ImageWithPlaceholder src={image.url} alt={title} size={image.width} />
      )}
    </Wrapper>
  );
};

export default ClickToPlay;
