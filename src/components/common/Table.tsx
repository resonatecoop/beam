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
    position: sticky;
    box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0 0 0 rgba(0, 0, 0, 0.14),
      0 0 0 rgba(0, 0, 0, 0.12);
    top: -12px;
    z-index: 2;
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
