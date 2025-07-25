import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../../theme";

export const TokenItem = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  cursor: pointer;
  
  &:hover {
    background: ${theme.color.background};
    border-radius: 8px;
  }
`;
