import { css } from "@emotion/css";
import React from "react";
import { Link } from "react-router-dom";
import { fetchArtist, fetchTrackGroups } from "../services/Api";
import ClickToPlay from "./common/ClickToPlay";
import GridListItem from "./common/GridListItem";
import LargeTileDetail from "./common/LargeTileDetail";
import Tooltip from "./common/Tooltip";
import TrackPopup from "./common/TrackPopup";

const newReleasesUl = css``;

const ReleaseItem: React.FC<{ group: Trackgroup }> = ({ group }) => {
  const [artistExists, setArtistExists] = React.useState<boolean>(false);

  const checkForArtist = React.useCallback(async () => {
    try {
      await fetchArtist(group.creatorId);
      setArtistExists(true);
    } catch (e) {
      setArtistExists(false);
    }
  }, [group.creatorId]);

  React.useEffect(() => {
    checkForArtist();
  }, [checkForArtist]);

  return (
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
          trackGroupType="trackgroup"
        />
      )}
      <LargeTileDetail
        title={<Link to={`/library/playlist/${group.id}`}>{group.title}</Link>}
        subtitle={
          <>
            {artistExists && (
              <Link
                to={`/library/artist/${group.creatorId}`}
                data-cy="artist-link"
              >
                {group.display_artist}
              </Link>
            )}
            {!artistExists && (
              <Tooltip hoverText="This artist is so fresh our servers haven't caught up yet">
                {group.display_artist}
              </Tooltip>
            )}
          </>
        }
        moreActions={<TrackPopup groupId={group.id} />}
      />
    </GridListItem>
  );
};

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
          <ReleaseItem group={group} key={group.id} />
        ))}
      </ul>
    </div>
  );
};

export default NewReleases;
