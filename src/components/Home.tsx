import { css } from "@emotion/css";
import React from "react";
import { tags } from "../constants";
import Tags from "./common/Tags";
import NewReleases from "./NewReleases";
import StaffPicks from "./StaffPicks";

export const Home: React.FC = () => {
  return (
    <>
      <h2>
        The co-operative music streaming platform. Owned and run by members.
      </h2>
      <div>
        <ul
          className={css`
            margin-bottom: 1rem;
          `}
        >
          <Tags tags={tags} />
        </ul>
        <NewReleases />
        <StaffPicks />
      </div>
    </>
  );
};

export default Home;
