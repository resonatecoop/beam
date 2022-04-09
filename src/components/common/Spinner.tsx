import React from "react";

import { css } from "@emotion/css";

const spinnerClass = css`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  div {
    position: absolute;
    border: 4px solid #555;
    opacity: 1;
    border-radius: 50%;
    animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }
  div:nth-child(2) {
    animation-delay: -0.5s;
  }
  @keyframes lds-ripple {
    0% {
      top: 36px;
      left: 36px;
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      top: 0px;
      left: 0px;
      width: 72px;
      height: 72px;
      opacity: 0;
    }
  }
`;

export const CenteredSpinner: React.FC = () => {
  return (
    <div
      className={css`
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
      `}
    >
      <Spinner />
    </div>
  );
};

export const Spinner: React.FC = () => {
  return (
    <div className={spinnerClass}>
      <div></div>
      <div></div>
    </div>
  );
};

export default Spinner;
