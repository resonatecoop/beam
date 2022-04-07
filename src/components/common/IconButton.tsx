import React from "react";

import { css } from "@emotion/css";

const buttonClass = css`
  border: none;
  color: rgba(0, 0, 0);
  background-color: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  cursor: pointer;
  transition: 0.5s;
  font-size: 1.4rem;
  line-height: 0.9;
  border-radius: 2px;

  &:hover {
    background-color: #fff;
  }
`;

export const IconButton: React.FC<{
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}> = ({ children, onClick, disabled, style }) => {
  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
};

export default IconButton;
