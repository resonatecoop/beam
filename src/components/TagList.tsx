import React from "react";
import { Link, useParams } from "react-router-dom";
import { fetchByTag } from "../services/Api";
import ClickToPlay from "./common/ClickToPlay";
import ResultListItem from "./common/ResultListItem";
import SmallTileDetails from "./common/SmallTileDetails";
import TrackPopup from "./common/TrackPopup";
import usePagination from "../utils/usePagination";

export const TagList: React.FC = () => {
  const { tagString } = useParams();

  const [trackgroups, setTrackgroups] = React.useState<TagResult[]>([]);

  const { LoadingButton, results } = usePagination<TagResult>({
    apiCall: fetchByTag,
    options: React.useMemo(
      () => ({ tag: tagString ?? "", limit: 10 }),
      [tagString]
    ),
  });

  React.useEffect(() => {
    setTrackgroups(results);
  }, [results]);

  return (
    <>
      <h3>{tagString}</h3>
      <div>
        <ul>
          {trackgroups.map((group) => (
            <ResultListItem key={group._id}>
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
            </ResultListItem>
          ))}
          {<LoadingButton />}
        </ul>
      </div>
    </>
  );
};

export default TagList;
