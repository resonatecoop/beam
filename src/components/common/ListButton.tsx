import { css } from "@emotion/css";
import styled from "@emotion/styled";
import { Compactable } from "./Button";

export const ListButton = styled.button<Compactable>`
  width: 100%;
  height: 100%;
  border: 0;
  margin: 0;
  padding: ${(props) => (props.compact ? "0" : "0.4rem 0.5rem")};
  text-align: inherit;
  font-size: inherit;
  background-color: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  transition: 0.5s background-color;

  &:hover {
    background-color: #cfcfcf;
  }

  &:active {
    background-color: var(--magenta);
  }

  &.active {
    background-color: #cfcfcf;
  }

  svg {
    margin-right: 0.5rem;
  }
`;

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
  display: flex;
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

export default ListButton;
