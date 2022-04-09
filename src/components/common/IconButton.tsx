import React from "react";

import { css, cx } from "@emotion/css";
import { ButtonProps } from "./Button";

const buttonClass = css`
  border: none;
  color: rgba(0, 0, 0);
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0.5rem;
  cursor: pointer;
  transition: 0.5s;
  font-size: 1.4rem;
  line-height: 0.9;
  border-radius: 2px;

  &:hover {
    background-color: #fff;
  }
`;

export const IconButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled,
  style,
  className,
}) => {
  return (
    <button
      className={cx(buttonClass, className)}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
};

export default IconButton;
