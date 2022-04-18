import styled from "@emotion/styled";

export const Table = styled.table`
  width: 100%;
  border: none;
  border-collapse: collapse;

  & tbody tr {
    transition: 0.25s background-color;
    &:nth-of-type(odd) {
      background-color: #dfdfdf;
    }
    &:hover {
      background-color: #bfbfbf !important;
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
