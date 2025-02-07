import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const InfoItem = styled(Flex)`
  gap: 8px;
`

export const GreenDot = styled(Flex)`
  width: 4px;
  height: 4px;
  background: ${theme.color.green2};
  border-radius: 50%;
`;