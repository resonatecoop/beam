import React from "react";
import { css } from "@emotion/css";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import { useGlobalStateContext } from "../contexts/globalState";
import { fetchTrack, registerPlay } from "../services/Api";
import { MdQueueMusic } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { bp } from "../constants";
import { FavoriteTrack } from "./common/FavoriteTrack";
import { buildStreamURL, mapFavoriteAndPlaysToTracks } from "../utils/tracks";
import Button from "./common/Button";

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
    state: { playerQueueIds, user, playing },
    dispatch,
  } = useGlobalStateContext();
  let navigate = useNavigate();
  const playerRef = React.useRef<any>();

  const [currentTrack, setCurrentTrack] = React.useState<TrackWithUserCounts>();
  const [mostlyListened, setMostlyListened] = React.useState(false);

  const fetchTrackCallback = React.useCallback(async (id: number) => {
    const track = await fetchTrack(id);
    const mappedTrack = (await mapFavoriteAndPlaysToTracks([track]))[0];
    setCurrentTrack(mappedTrack);
  }, []);

  React.useEffect(() => {
    if (playerQueueIds && playerQueueIds[0]) {
      fetchTrackCallback(playerQueueIds[0]);
    }
  }, [fetchTrackCallback, playerQueueIds]);

  const onEnded = React.useCallback(async () => {
    if (!mostlyListened && currentTrack && user) {
      try {
        await registerPlay(user?.id, currentTrack.id);
      } catch (e) {
        console.error(e);
      }
    }
    dispatch({ type: "popFromFrontOfQueue" });
    setMostlyListened(false);
  }, [currentTrack, dispatch, mostlyListened, user]);

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

  React.useEffect(() => {
    if (playerRef?.current && playing) {
      playerRef.current.audio.current.play();
    } else if (playerRef?.current) {
      playerRef.current.audio.current.pause();
    }
  }, [playing]);

  return (
    <div className={playerClass}>
      {currentTrack && (
        <div className={trackInfo}>
          <img
            src={currentTrack.images.small?.url ?? currentTrack.cover}
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
          <div
            className={css`
              flex-grow: 1;
              text-align: right;
              padding-right: 1rem;
            `}
          >
            <FavoriteTrack track={currentTrack} />
          </div>
        </div>
      )}
      <div
        className={css`
          display: flex;
          align-items: center;
          flex-grow: 1;
          @media (max-width: ${bp.small}px) {
            width: 100%;
          }
        `}
      >
        <AudioPlayer
          src={buildStreamURL(playerQueueIds[0], user?.clientId)}
          ref={playerRef}
          autoPlayAfterSrcChange
          onEnded={onEnded}
          onListen={onListen}
          layout="horizontal"
          className={css`
            &.rhap_container {
              box-shadow: none;
              padding: 0;
            }
          `}
        />
        <Button
          onClick={onClickQueue}
          compact
          variant="link"
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
