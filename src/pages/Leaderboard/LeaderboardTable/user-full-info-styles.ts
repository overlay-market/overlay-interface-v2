import { Text } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const TextValue = styled(Text)`
  color: ${theme.color.grey3};
`

export const TextLabel = styled(Text)`
  color: ${theme.color.blue1};
  display: inline-block;
  max-width: 120px; 
  white-space: normal; 
  word-break: break-word; 
  line-height: 1.3;
  text-align: right; 
`