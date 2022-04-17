import { css } from "@emotion/css";
import React from "react";
import { Link } from "react-router-dom";
import { tags } from "../constants";
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
          {tags.map((tag) => (
            <li
              key={tag}
              className={css`
                display: inline-block;
                background-color: white;
                padding: 0.25rem 0.4rem;
                margin-right: 0.25rem;
                margin-bottom: 0.25rem;
              `}
            >
              <Link to={`/tag/${tag}`}>#{tag}</Link>
            </li>
          ))}
        </ul>
        <NewReleases />
        <StaffPicks />
      </div>
    </>
  );
};

export default Home;
