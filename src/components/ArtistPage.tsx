import { css } from "@emotion/css";
import React from "react";
import { useParams } from "react-router-dom";
import {
  fetchArtist,
  fetchArtistReleases,
  fetchArtistTopTracks,
} from "../services/Api";
import LinkToWeb from "./common/LinkToWeb";
import OverflowableText from "./common/OverflowableText";
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
  const [releases, setReleases] = React.useState<ArtistRelease[]>();

  const fetchTracks = React.useCallback(async (id: number) => {
    setIsLoading(true);
    const result = await fetchArtist(id);
    const topTracks = await fetchArtistTopTracks(id);
    const artistReleases = await fetchArtistReleases(id);
    setArtist(result);
    setTracks(topTracks);
    setReleases(artistReleases);
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
          <p className={padding}>
            {artist.links.map((link) => (
              <LinkToWeb key={link.href} link={link} />
            ))}
          </p>
          {tracks && (
            <>
              <h3>Top Tracks</h3>
              <TrackTable tracks={tracks} />
            </>
          )}
          {releases && (
            <>
              <h3 style={{ marginTop: "1rem" }}>Releases</h3>
              {releases.map((release) => (
                <div key={release.id} style={{ marginBottom: "1rem" }}>
                  <h4>{release.title}</h4>
                  {release.about && (
                    <div className={padding}>
                      <OverflowableText text={release.about} />
                    </div>
                  )}

                  <TrackTable
                    tracks={release.items.map((item) => item.track)}
                  />
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ArtistPage;
