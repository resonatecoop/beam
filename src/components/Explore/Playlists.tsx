import { css } from "@emotion/css";
import ClickToPlay from "components/common/ClickToPlay";
import React from "react";
import { Link } from "react-router-dom";
import { fetchPlaylists } from "../../services/Api";
import usePagination from "../../utils/usePagination";
import GridListItem from "../common/GridListItem";
import LargeTileDetail from "../common/LargeTileDetail";
import { CenteredSpinner } from "../common/Spinner";
import StaffPicks from "../StaffPicks";

export const Playlists: React.FC = () => {
  const { LoadingButton, results, isLoading } = usePagination<Trackgroup>({
    apiCall: React.useCallback(fetchPlaylists, []),
    options: React.useMemo(() => ({ limit: 20, type: "playlist" }), []),
  });

  return (
    <>
      <StaffPicks />

      <div
        className={css`
          margin-top: 2rem;
        `}
      >
        <h3>All Playlists</h3>

        {isLoading && <CenteredSpinner />}

        <ul>
          {results.map((playlist) => {
            return (
              <GridListItem key={playlist.id} maxWidth={300}>
                <ClickToPlay
                  image={{
                    ...playlist.images.medium,
                    width: 300,
                    height: 300,
                  }}
                  title={playlist.title}
                  trackGroupType="playlist"
                  groupId={playlist.id}
                />
                <LargeTileDetail
                  title={
                    <Link to={`/library/playlist/${playlist.id}`}>
                      {playlist.title}
                    </Link>
                  }
                />
              </GridListItem>
            );
          })}
        </ul>
        <LoadingButton />
      </div>
    </>
  );
};

export default Playlists;
