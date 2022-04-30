import styled from "@emotion/styled";
import { colorShade } from "utils/theme";
import { Compactable } from "./Button";

const IconButton = styled.button<Compactable>`
  border: none;
  color: rgba(0, 0, 0);
  background-color: transparent;
  padding: ${(props) => (props.compact ? "0" : "0.4rem 0.5rem")};
  cursor: pointer;
  transition: 0.25s;
  font-size: ${(props) => (props.compact ? "1rem" : "1.4rem")};
  line-height: 0.9;
  border-radius: 2px;

  &:hover,
  &:focus {
    color: ${(props) => colorShade(props.theme.colors.text, 80)};
  }
`;

export default IconButton;
