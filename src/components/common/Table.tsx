import styled from "@emotion/styled";
import { colorShade } from "utils/theme";

export const Table = styled.table`
  width: 100%;
  border: none;
  border-collapse: collapse;

  & tbody tr {
    transition: 0.25s background-color;
    &:nth-of-type(odd) {
      background-color: ${(props) =>
        colorShade(props.theme.colors.background, -10)};
    }
    &:hover {
      background-color: ${(props) =>
        colorShade(props.theme.colors.background, -40)} !important;
    }
  }

  & th {
    text-align: left;
    background-color: #d8d8d8;
  }
  & td,
  & th {
    padding: 0.5rem 1rem;
  }
  & td.alignRight,
  & th.alignRight {
    text-align: right;
  }
`;

export default Table;
