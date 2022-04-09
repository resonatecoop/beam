import styled from "@emotion/styled";

export const Table = styled.table`
  width: 100%;
  border: none;
  border-collapse: collapse;

  & tbody tr:nth-child(odd) {
    background: #dfdfdf;
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
