import { Box } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const HeaderEmptyPlaceholder = styled(Box)`
  height: 0;

  @media (min-width: 1024px) {
    width: 100%;
    height: ${theme.headerSize.height};
    border-bottom: 1px solid ${theme.color.darkBlue};
  }
`;