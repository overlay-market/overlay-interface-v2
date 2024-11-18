import { Box } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const HeaderEmptyPlaceholder = styled(Box)`
  height: 0;
  margin: 0 15px;
  border-bottom: 1px solid ${theme.color.darkBlue};

  @media (min-width: ${theme.breakpoints.sm}) {
    width: 100%;
    margin: 0;
    height: ${theme.headerSize.height};
  }
`;