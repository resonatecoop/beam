import styled from "@emotion/styled";
import constants from "../../constants";

export const ResultListItem = styled.li`
  display: inline-flex;
  margin-right: 0.5rem;
  width: 45%;
  @media (max-width: ${constants.bp.medium}px) {
    width: 100%;
  }
`;

export default ResultListItem;
