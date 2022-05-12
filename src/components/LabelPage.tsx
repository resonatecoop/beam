import { css } from "@emotion/css";
import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  fetchLabel,
  fetchLabelArtists,
  fetchLabelReleases,
} from "../services/Api";
import EmptyBox from "./common/EmptyBox";
import GridListItem from "./common/GridListItem";
import ImageWithPlaceholder from "./common/ImageWithPlaceholder";
import LinkToWeb from "./common/LinkToWeb";
import OverflowableText from "./common/OverflowableText";
import Release from "./common/Release";
import { CenteredSpinner } from "./common/Spinner";

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
            {label.links?.map((link) => (
              <LinkToWeb key={link.href} link={link} />
            ))}
          </p>

          {(!artists || artists.length === 0) && !releases && (
            <EmptyBox>This label has no artists</EmptyBox>
          )}

          {artists && artists.length > 0 && (
            <>
              <h4 style={{ marginTop: "1rem" }}>Artists</h4>
              {artists.map((artist) => (
                <GridListItem key={artist.id} maxWidth={120}>
                  <ImageWithPlaceholder
                    src={artist.images?.["profile_photo-sm"]}
                    alt={artist.name}
                    size={120}
                    className={css`
                      margin: 0 1rem 0.25rem 0;
                    `}
                  />
                  <Link to={`/library/artist/${artist.id}`}>{artist.name}</Link>
                </GridListItem>
              ))}
            </>
          )}

          {releases && releases.length > 0 && (
            <>
              <h4 style={{ marginTop: "1rem" }}>Releases</h4>
              {releases.map((release) => (
                <Release release={release} key={release.id} />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default LabelPage;
