import styled from "styled-components";
import theme from "../../../theme";

export const MarketsLogos = styled.img`
  width: 36px;
  height: 36px;
  object-fit: cover;
  border-radius: 20%;
  border: 1px solid rgba(236, 236, 236, 0.15);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  @media (min-width: ${theme.breakpoints.md}) {
    width: 62px;
    height: 62px;
  }
`;
