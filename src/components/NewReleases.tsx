import { css } from "@emotion/css";
import React from "react";
import constants from "../constants";
import { fetchTrackGroups } from "../services/Api";
import ClickToPlay from "./common/ClickToPlay";

const newReleasesUl = css``;

const newReleasesLi = css`
  display: inline-flex;
  flex-direction: column;
  margin: 0.5rem 1rem 0.5rem 0;

  @media (max-width: ${constants.bp.small}px) {
    margin-right: 0;
  }

  img {
    background: #dfdfdf;
  }
`;

export const NewReleases: React.FC = () => {
  const [trackgroups, setTrackgroups] = React.useState<Trackgroup[]>([]);

  const fetchTrackGroupsCallback = React.useCallback(async () => {
    await fetchTrackGroups({ limit: 8 }).then((result) => {
      setTrackgroups(result);
    });
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
            <span>{group.title}</span>
            <span>{group.display_artist}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewReleases;
