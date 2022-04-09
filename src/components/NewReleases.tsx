import { css } from "@emotion/css";
import React from "react";
import { Link } from "react-router-dom";
import constants from "../constants";
import { fetchTrackGroups } from "../services/Api";
import ClickToPlay from "./common/ClickToPlay";
import TrackPopup from "./common/TrackPopup";

const newReleasesUl = css``;

const newReleasesLi = css`
  display: inline-flex;
  flex-direction: column;
  margin: 0.5rem 1rem 0.75rem 0;

  @media (max-width: ${constants.bp.medium}px) {
    margin-right: 0;
  }

  img {
    background: #dfdfdf;
  }
`;

export const NewReleases: React.FC = () => {
  const [trackgroups, setTrackgroups] = React.useState<Trackgroup[]>([]);

  const fetchTrackGroupsCallback = React.useCallback(async () => {
    const result = await fetchTrackGroups({ limit: 8 });
    setTrackgroups(result);
  }, []);

  React.useEffect(() => {
    fetchTrackGroupsCallback();
  }, [fetchTrackGroupsCallback]);

  return (
    <div>
      <h3>New releases</h3>
      <ul className={newReleasesUl}>
        {trackgroups.map((group) => (
          <li key={group.id} className={newReleasesLi}>
            <ClickToPlay
              image={group.images.medium}
              title={group.title}
              groupId={group.id}
            />
            <div
              className={css`
                display: flex;
                margin: 0.5rem 0;
                justify-content: space-between;
              `}
            >
              <div
                className={css`
                  display: flex;
                  flex-direction: column;
                `}
              >
                <span
                  className={css`
                    font-size: 1.1rem;
                  `}
                >
                  {group.title}
                </span>
                <span
                  className={css`
                    margin-top: 0.5rem;
                    color: #444;
                    text-decoration: none;
                  `}
                >
                  <Link to={`/library/artist/${group.creator_id}`}>
                    {group.display_artist}
                  </Link>
                </span>
              </div>
              <TrackPopup groupId={group.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewReleases;
