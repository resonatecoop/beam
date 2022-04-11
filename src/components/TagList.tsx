import { css } from "@emotion/css";
import React from "react";
import { Link, useParams } from "react-router-dom";
import constants from "../constants";
import { fetchByTag } from "../services/Api";
import ClickToPlay from "./common/ClickToPlay";
import SmallTileDetails from "./common/SmallTileDetails";
import TrackPopup from "./common/TrackPopup";

export const TagList: React.FC = () => {
  const { tagString } = useParams();

  const [trackgroups, setTrackgroups] = React.useState<TagResult[]>([]);

  const fetchTagCallback = React.useCallback(async (tag: string) => {
    const result = await fetchByTag(tag);
    setTrackgroups(result);
  }, []);

  React.useEffect(() => {
    if (tagString) {
      fetchTagCallback(tagString);
    }
  }, [fetchTagCallback, tagString]);

  return (
    <>
      <h3>{tagString}</h3>
      <div>
        <ul>
          {trackgroups.map((group) => (
            <li
              key={group._id}
              className={css`
                display: inline-flex;
                margin-right: 0.5rem;
                width: 45%;
                @media (max-width: ${constants.bp.medium}px) {
                  width: 100%;
                }
              `}
            >
              {group.images.small && (
                <ClickToPlay
                  image={group.images.small}
                  title={group.title}
                  groupId={group._id}
                />
              )}
              <SmallTileDetails
                title={group.title}
                subtitle={
                  <Link to={`/library/artist/${group.creator_id}`}>
                    {group.display_artist}
                  </Link>
                }
                moreActions={<TrackPopup groupId={group.track_group_id} />}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TagList;
