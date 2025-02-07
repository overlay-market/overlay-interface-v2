import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const InfoCard = styled(Flex)`
  flex-direction: column;
  padding: 16px;
  gap: 8px;
  width: 100%;
  background: ${theme.color.background};
  border-radius: 8px;
`