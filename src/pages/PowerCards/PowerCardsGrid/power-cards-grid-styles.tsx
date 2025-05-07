import styled from "styled-components";
import theme from "../../../theme";

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(348px, 1fr));
  gap: 16px;
  padding: 16px 0;
  width: 100%;

  @media (min-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fill, minmax(207px, 1fr));
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(auto-fill, minmax(278px, 1fr));
  }
`;
