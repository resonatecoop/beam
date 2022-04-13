import React from "react";
import { Link, useParams } from "react-router-dom";
import { fetchByTag } from "../services/Api";
import ClickToPlay from "./common/ClickToPlay";
import ResultListItem from "./common/ResultListItem";
import SmallTileDetails from "./common/SmallTileDetails";
import { CenteredSpinner } from "./common/Spinner";
import TrackPopup from "./common/TrackPopup";
import usePagination from "../utils/usePagination";

export const TagList: React.FC = () => {
  const { tagString } = useParams();
  const [isLoading, setLoading] = React.useState(false);

  const [trackgroups, setTrackgroups] = React.useState<TagResult[]>([]);

  const fetchTagCallback = React.useCallback(
    async (tag: string, nextPage?: number) => {
      setLoading(true);
      const result = await fetchByTag(tag, { limit: 20, page: nextPage ?? 1 });
      setTrackgroups((groups) => [...groups, ...result]);
      setLoading(false);
    },
    []
  );

  const callbackFnc = React.useCallback(
    async (nextPage?: number) => {
      if (tagString) {
        await fetchTagCallback(tagString, nextPage);
      }
    },
    [fetchTagCallback, tagString]
  );

  const { LoadingButton } = usePagination({ callbackFnc });

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
          {isLoading && <CenteredSpinner />}
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
          {trackgroups.length > 0 && <LoadingButton />}
        </ul>
      </div>
    </>
  );
};

export default TagList;
