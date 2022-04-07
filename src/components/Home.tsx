import React from "react";
import NewReleases from "./NewReleases";
import StaffPicks from "./StaffPicks";

export const Home: React.FC = () => {
  return (
    <>
      <h2>
        The co-operative music streaming platform. Owned and run by members.
      </h2>
      <div>
        <NewReleases />
        <StaffPicks />
      </div>
    </>
  );
};

export default Home;
