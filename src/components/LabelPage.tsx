import { css } from "@emotion/css";
import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  fetchLabel,
  fetchLabelArtists,
  fetchLabelReleases,
} from "../services/Api";
import LinkToWeb from "./common/LinkToWeb";
import OverflowableText from "./common/OverflowableText";
import { CenteredSpinner } from "./common/Spinner";
import Tags from "./common/Tags";
import TrackTable from "./common/TrackTable";

const padding = css`
  padding: 0 1rem 1rem;
`;

export const LabelPage: React.FC = () => {
  let { labelId } = useParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [label, setLabel] = React.useState<Label>();
  const [artists, setArtists] = React.useState<LabelArtist[]>();
  const [releases, setReleases] = React.useState<Release[]>();

  const fetchTracks = React.useCallback(async (id: number) => {
    setIsLoading(true);
    const label = await fetchLabel(id);
    const releases = await fetchLabelReleases(id);
    const artists = await fetchLabelArtists(id);
    setLabel(label);
    setArtists(artists);
    setReleases(releases);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (labelId) {
      fetchTracks(+labelId);
    }
  }, [fetchTracks, labelId]);

  return (
    <div
      className={css`
        flex-grow: 1;
      `}
    >
      {isLoading && <CenteredSpinner />}
      {!isLoading && label && (
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
              backgroundImage: `url(${label.images?.["cover_photo-l"]})`,
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
              {label.name}
            </h3>
          </div>
          <div className={padding}>
            <OverflowableText text={label.bio} />
          </div>
          <p className={padding}>
            {label.links.map((link) => (
              <LinkToWeb key={link.href} link={link} />
            ))}
          </p>

          {artists && (
            <>
              <h4 style={{ marginTop: "1rem" }}>artists</h4>
              {artists.map((artist) => (
                <div key={artist.id} style={{ marginBottom: "1rem" }}>
                  <div
                    className={css`
                      // margin: 1rem;
                      display: flex;
                      margin-bottom: 1rem;
                      flex-direction: column;
                    `}
                  >
                    <img
                      src={artist.images?.["profile_photo-sm"]}
                      alt={artist.name}
                      height={120}
                      width={120}
                      className={css`
                        margin: 0 1rem 0.25rem 0;
                      `}
                    />
                    <div>
                      <Link to={`/library/artist/${artist.id}`}>
                        {artist.name}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {releases && (
            <>
              <h4 style={{ marginTop: "1rem" }}>Releases</h4>
              {releases.map((release) => (
                <div key={release.id} style={{ marginBottom: "1rem" }}>
                  <div
                    className={css`
                      // margin: 1rem;
                      display: flex;
                      margin-bottom: 1rem;
                    `}
                  >
                    <img
                      src={release.images.small?.url}
                      alt={release.title}
                      height={release.images.small?.height}
                      width={release.images.small?.width}
                      className={css`
                        margin: 0 1rem 1rem 0;
                      `}
                    />
                    <div>
                      <h4>{release.title}</h4>

                      {release.about && (
                        <div
                          className={css`
                            margin-bottom: 1rem;
                          `}
                        >
                          <OverflowableText text={release.about} />
                        </div>
                      )}
                      <Tags tags={release.tags} />
                    </div>
                  </div>
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

export default LabelPage;
