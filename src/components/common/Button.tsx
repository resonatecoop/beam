import React from "react";

import { css } from "@emotion/css";

const buttonClass = css`
  border: none;
  background: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  line-height: 1rem;
  padding: 1rem;
  background-color: #eee;
  border-radius: 2px;
  margin-right: 0.25rem;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background-color: #ddd;
    cursor: pointer;
  }

  & .startIcon {
    margin-right: 1rem;
    line-height: 0.785rem;
  }

  & .endIcon {
    margin-left: 1rem;
    line-height: 0.785rem;
  }
`;

export interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  compact?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  startIcon,
  endIcon,
  disabled,
}) => {
  return (
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      {startIcon ? <span className="startIcon">{startIcon}</span> : ""}
      {children}
      {endIcon ? <span className="endIcon">{endIcon}</span> : ""}
    </button>
  );
};

export default Button;
