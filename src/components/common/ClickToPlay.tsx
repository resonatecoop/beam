import styled from "@emotion/styled";
import React from "react";

import { FaPlay } from "react-icons/fa";
import { MdQueue } from "react-icons/md";
import constants from "../../constants";

import { useGlobalStateContext } from "../../contexts/globalState";
import { fetchTrackGroup } from "../../services/Api";
import IconButton from "./IconButton";

type WrapperProps = {
  width: number;
  height: number;
};

const Wrapper = styled.div<WrapperProps>`
  position: relative;
  max-width: 100%;

  & .play {
    display: flex;
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
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 1;
    }
  }

  button {
    margin-right: 0.5rem;
    margin-left: 0.5rem;
  }

  @media (max-width: ${constants.bp.medium}px) {
    position: relative;
    .play {
      width: 100%;
      opacity: 1;
      bottom: 0;
      top: auto;
      height: 50px;
      position: absolute;
    }

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
}> = ({ groupId, title, image, trackId }) => {
  const { dispatch } = useGlobalStateContext();

  const onClickPlay = React.useCallback(async () => {
    if (groupId) {
      await fetchTrackGroup(groupId).then((result) => {
        dispatch({
          type: "addTrackIdsToFrontOfQueue",
          idsToAdd: result.items.map((item) => item.track.id),
        });
      });
    } else if (trackId) {
      dispatch({
        type: "addTrackIdsToFrontOfQueue",
        idsToAdd: [trackId],
      });
    }
  }, [dispatch, groupId, trackId]);

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
  }, [dispatch, groupId, trackId]);

  return (
    <Wrapper width={image?.width ?? 0} height={image?.height ?? 0}>
      <div className="play">
        <IconButton onClick={onClickPlay}>
          <FaPlay />
        </IconButton>
        <IconButton onClick={onClickQueue}>
          <MdQueue />
        </IconButton>
      </div>
      {image && (
        <img
          src={image.url}
          alt={title}
          width={image.width}
          height={image.height}
        />
      )}
    </Wrapper>
  );
};

export default ClickToPlay;
