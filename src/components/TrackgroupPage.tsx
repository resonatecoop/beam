import { css } from "@emotion/css";
import React from "react";
import { useParams } from "react-router-dom";
import { fetchTrackGroup } from "../services/Api";
import { CenteredSpinner } from "./common/Spinner";
import TrackTable from "./common/TrackTable";

const padding = css`
  padding: 0 1rem 1rem;
`;

export const TrackgroupPage: React.FC = () => {
  let { trackgroupId } = useParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [trackgroup, setTrackgroup] = React.useState<TrackgroupDetail>();

  const fetchTracks = React.useCallback(async (id: string) => {
    setIsLoading(true);
    const result = await fetchTrackGroup(id);
    setTrackgroup(result);
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
      {!isLoading && trackgroup && (
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
              backgroundImage: `url(${trackgroup.cover})`,
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
              {trackgroup.title}
            </h3>
          </div>
          <p className={padding}>{trackgroup.about}</p>

          {trackgroup && (
            <>
              <TrackTable tracks={trackgroup.items.map((item) => item.track)} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TrackgroupPage;
