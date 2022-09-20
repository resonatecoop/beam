import { css } from "@emotion/css";
import React from "react";

import Tabs from "./common/Tabs";
import { NavLink, Outlet } from "react-router-dom";

export const Admin: React.FC = () => {
  return (
    <>
      <Tabs>
        <li>
          <NavLink to="users">Users</NavLink>
        </li>
        <li>
          <NavLink to="trackgroups">Trackgroups</NavLink>
        </li>
        <li>
          <NavLink to="tracks">Tracks</NavLink>
        </li>
      </Tabs>
      <div
        className={css`
          margin: 1rem 0 0;
        `}
      >
        <Outlet />
      </div>
    </>
  );
};

export default Admin;
