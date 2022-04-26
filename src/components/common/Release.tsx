import { css } from "@emotion/css";
import React from "react";
import ClickToPlay from "./ClickToPlay";
import OverflowableText from "./OverflowableText";
import Tags from "./Tags";
import TrackTable from "./TrackTable";

const Release: React.FC<{ release: Partial<TrackgroupDetail> }> = ({
  release,
}) => {
  const [items] = React.useState(
    release.items?.map((item) => item.track) ?? []
  );
  return (
    <div key={release.id} style={{ marginBottom: "1rem" }}>
      <div
        className={css`
          display: flex;
          margin-bottom: 1rem;
        `}
      >
        <ClickToPlay
          image={{
            ...release.images?.small,
            width: release.images?.small?.width ?? 120,
            height: release.images?.small?.height ?? 120,
          }}
          title={release.title ?? ""}
          groupId={release.id}
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
          <Tags tags={release.tags ?? []} />
        </div>
      </div>
      <TrackTable tracks={items} />
    </div>
  );
};

export default Release;
