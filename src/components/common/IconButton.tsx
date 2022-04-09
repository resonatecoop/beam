import styled from "@emotion/styled";

interface ListButtonProp {
  compact?: boolean;
}

const IconButton = styled.button<ListButtonProp>`
  border: none;
  color: rgba(0, 0, 0);
  background-color: transparent;
  padding: ${(props) => (props.compact ? "0" : "0.4rem 0.5rem")};
  cursor: pointer;
  transition: 0.25s;
  font-size: ${(props) => (props.compact ? "1rem" : "1.4rem")};
  line-height: 0.9;
  border-radius: 2px;

  &:hover {
    color: #888;
  }
`;

export default IconButton;
