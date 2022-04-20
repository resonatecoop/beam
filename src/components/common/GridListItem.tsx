import styled from "@emotion/styled";
import { bp } from "../../constants";

type Props = {
  maxWidth: number;
};

export const GridListItem = styled.li<Props>`
  display: inline-flex;
  flex-direction: column;
  margin: 0.5rem 1rem 0.75rem 0;
  max-width: ${(props) => props.maxWidth}px;

  @media (max-width: ${bp.medium}px) {
    margin-right: 0;
  }
`;

export default GridListItem;
