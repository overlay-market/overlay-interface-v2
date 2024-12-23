import { Box } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const InfoBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  background: ${theme.color.grey4};

  @media (min-width: ${theme.breakpoints.sm}) {      
    flex-direction: column;
    justify-content: start;
  }
  @media (min-width: ${theme.breakpoints.md}) {     
    flex-direction: row;
    justify-content: space-between;
  }
`