import { css } from "@emotion/css";
import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  fetchArtist,
  fetchArtistReleases,
  fetchArtistTopTracks,
} from "../services/Api";
import EmptyBox from "./common/EmptyBox";
import LinkToWeb from "./common/LinkToWeb";
import OverflowableText from "./common/OverflowableText";
import Release from "./common/Release";
import { CenteredSpinner } from "./common/Spinner";
import TrackTable from "./common/TrackTable";

const padding = css`
  padding: 0 1rem 1rem;
`;

export const ArtistPage: React.FC = () => {
  let { artistId } = useParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [tracks, setTracks] = React.useState<Track[]>();
  const [artist, setArtist] = React.useState<Artist>();
  const [releases, setReleases] = React.useState<Release[]>();

  const fetchTracks = React.useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      const result = await fetchArtist(id);
      setArtist(result);
    } catch (e) {
      console.error(e);
    } finally {
    }
    try {
      const topTracks = await fetchArtistTopTracks(id);
      setTracks(topTracks);
    } catch (e) {
      console.error(e);
    }
    try {
      const artistReleases = await fetchArtistReleases(id);
      setReleases(artistReleases);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (artistId) {
      fetchTracks(+artistId);
    }
  }, [fetchTracks, artistId]);

  return (
    <div
      className={css`
        flex-grow: 1;
      `}
    >
      {isLoading && <CenteredSpinner />}
      {!isLoading && artist && (
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
              backgroundImage: `url(${artist.images?.["cover_photo-l"]})`,
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
              {artist.name}
            </h3>
          </div>
          <div className={padding}>
            <OverflowableText text={artist.bio} />
          </div>
          <p className={padding}>{artist.country}</p>
          {artist.label && (
            <p className={padding}>
              <Link to={`/library/label/${artist.label.id}`}>
                {artist.label.name}
              </Link>
            </p>
          )}
          <p className={padding}>
            {artist.links?.map((link) => (
              <LinkToWeb key={link.href} link={link} />
            ))}
          </p>
          {tracks && (
            <>
              <h4>Top Tracks</h4>
              <TrackTable tracks={tracks} />
            </>
          )}
          {releases && (
            <>
              <h4 style={{ marginTop: "1rem" }}>Releases</h4>
              {releases.map((release) => (
                <Release release={release} key={release.id} />
              ))}
            </>
          )}
          {!tracks && !releases && <EmptyBox>No tracks to display</EmptyBox>}
        </>
      )}
    </div>
  );
};

export default ArtistPage;
