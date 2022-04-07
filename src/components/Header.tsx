import React from "react";
import { css } from "@emotion/css";

import Login from "./Login";

const headerClass = css`
  min-height: 48px;
  border-bottom: 1px solid grey;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  position: fixed;
  width: 100%;
  z-index: 1;
  top: 0;
  background-color: #fff;
`;

const Header: React.FC = () => {
  return (
    <header className={headerClass}>
      <div>no-logo</div>
      <Login />
    </header>
  );
};

export default Header;
