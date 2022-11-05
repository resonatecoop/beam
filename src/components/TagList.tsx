import React, { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchByTag } from "../services/Api";
import ClickToPlay from "./common/ClickToPlay";
import ResultListItem from "./common/ResultListItem";
import SmallTileDetails from "./common/SmallTileDetails";
import TrackPopup from "./common/TrackPopup";
import Tags from "./common/Tags";

export const TagList: React.FC = () => {
  const { tagString } = useParams();

  const [trackgroups, setTrackgroups] = React.useState<Trackgroup[]>([]);

  const fetchTaggedItems = useCallback(async () => {
    const { data } = await fetchByTag({ tag: tagString ?? "" });

    setTrackgroups(data.trackgroups);
  }, [tagString]);

  React.useEffect(() => {
    fetchTaggedItems();
  }, [fetchTaggedItems]);

  return (
    <>
      <h3>{tagString}</h3>
      <div>
        <ul>
          {trackgroups.map((group) => (
            <ResultListItem key={group.id}>
              {group.images?.small && (
                <ClickToPlay
                  image={group.images.small}
                  title={group.title}
                  groupId={group.id}
                  trackGroupType="trackgroup"
                />
              )}
              <SmallTileDetails
                title={group.title}
                subtitle={
                  <Link to={`/library/artist/${group.creatorId}`}>
                    {group.display_artist}
                  </Link>
                }
                footer={<Tags tags={group.tags} />}
                moreActions={<TrackPopup groupId={group.id} />}
              />
            </ResultListItem>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TagList;
