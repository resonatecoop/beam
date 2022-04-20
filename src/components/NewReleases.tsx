import { css } from "@emotion/css";
import React from "react";
import { Link } from "react-router-dom";
import { fetchTrackGroups } from "../services/Api";
import ClickToPlay from "./common/ClickToPlay";
import GridListItem from "./common/GridListItem";
import LargeTileDetail from "./common/LargeTileDetail";
import TrackPopup from "./common/TrackPopup";

const newReleasesUl = css``;

export const NewReleases: React.FC = () => {
  const [trackgroups, setTrackgroups] = React.useState<Trackgroup[]>([]);

  const fetchTrackGroupsCallback = React.useCallback(async () => {
    const result = await fetchTrackGroups({ limit: 4 });
    setTrackgroups(result.data);
  }, []);

  React.useEffect(() => {
    fetchTrackGroupsCallback();
  }, [fetchTrackGroupsCallback]);

  return (
    <div>
      <h3>New releases</h3>
      <ul className={newReleasesUl}>
        {trackgroups.map((group) => (
          <GridListItem key={group.id} maxWidth={400}>
            {group.images.medium && (
              <ClickToPlay
                image={{
                  ...group.images.medium,
                  width: 400,
                  height: 400,
                }}
                title={group.title}
                groupId={group.id}
              />
            )}
            <LargeTileDetail
              title={
                <Link to={`/library/trackgroup/${group.id}`}>
                  {group.title}
                </Link>
              }
              subtitle={
                <Link to={`/library/artist/${group.creator_id}`}>
                  {group.display_artist}
                </Link>
              }
              moreActions={<TrackPopup groupId={group.id} />}
            />
          </GridListItem>
        ))}
      </ul>
    </div>
  );
};

export default NewReleases;
