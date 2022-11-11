import { css } from "@emotion/css";
import React from "react";
import { useParams } from "react-router-dom";
import { fetchPlaylist } from "../services/Api";
import BuyAlbumButton from "./common/BuyAlbumButton";
import ShareTrackgroupButton from "./common/ShareTrackgroupButton";
import { CenteredSpinner } from "./common/Spinner";
import Tags from "./common/Tags";
import TrackTable from "./common/TrackTable";

const padding = css`
  padding: 0 1rem 1rem;
`;

export const PlaylistPage: React.FC = () => {
  let { trackgroupId } = useParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [playlist, setPlaylist] = React.useState<TrackgroupDetail>();
  const [tracks, setTracks] = React.useState<Track[]>([]);

  const fetchTracks = React.useCallback(async (id: string) => {
    setIsLoading(true);
    const result = await fetchPlaylist(id);
    setPlaylist(result);
    setTracks(result.items.map((item) => item.track));
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (trackgroupId) {
      fetchTracks(trackgroupId);
    }
  }, [fetchTracks, trackgroupId]);

  return (
    <div
      className={css`
        flex-grow: 1;
      `}
    >
      {isLoading && <CenteredSpinner />}
      {!isLoading && playlist && (
        <>
          <div
            className={css`
              min-height: 300px;
              display: flex;
              align-items: flex-end;
              color: white;
              margin-bottom: 1rem;
            `}
            style={{
              backgroundImage: `url(${playlist.cover})`,
            }}
          >
            <h3
              className={css`
                padding: 3rem 1rem 1rem;
                width: 100%;
                background-image: linear-gradient(
                  transparent,
                  rgba(0, 0, 0, 0.7)
                );
              `}
            >
              {playlist.title}
            </h3>
          </div>
          <p className={padding}>{playlist.about}</p>
          <div
            className={css`
              display: flex;
              align-items: center;
              margin-left: 1rem;
              margin-bottom: 1rem;
            `}
          >
            <ShareTrackgroupButton trackgroup={playlist} />
            {playlist.type !== "playlist" && (
              <BuyAlbumButton trackgroup={playlist} />
            )}
          </div>

          <div className={padding}>
            <Tags tags={playlist.tags} />
          </div>
          {playlist && (
            <>
              <TrackTable
                trackgroupId={playlist.id}
                tracks={tracks}
                isPlaylist
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PlaylistPage;
