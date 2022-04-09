import { css } from "@emotion/css";
import React from "react";
import { ButtonProps } from "./Button";

export const listButtonClass = css`
  width: 100%;
  height: 100%;
  border: 0;
  margin: 0;
  padding: 0.4rem 0.5rem;
  text-align: inherit;
  font-size: inherit;
  background-color: inherit;
  cursor: pointer;
  display: block;
  text-decoration: none;
  color: #333;
  transition: 0.5s background-color;

  &:hover {
    background-color: #cfcfcf;
  }

  &.active {
    background-color: #cfcfcf;
  }
`;

export const ListButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button className={listButtonClass} {...props}>
      {children}
    </button>
  );
};

export default ListButton;
