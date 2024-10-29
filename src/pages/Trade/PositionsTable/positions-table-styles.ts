import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const PositionsTableContainer = styled(Flex)`
  flex-direction: column;
  width: 100%;
  padding: 16px 8px 66px;
  border-bottom: 1px solid ${theme.color.darkBlue};
  border-top: 1px solid ${theme.color.darkBlue};
`;
