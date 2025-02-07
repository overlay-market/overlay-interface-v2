import { Flex, Text } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const RewardBox = styled(Flex)`
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  background: ${theme.color.grey4};
  border: 1px solid ${theme.color.grey4};  
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.25);
`

export const ApyBadge = styled(Flex)`
  align-items: center;
  width: fit-content;
  padding: 3px 8px;
  border-radius: 16px;
  background: ${theme.color.green2}20;
`

export const ApyBagdeText = styled(Text)`
  font-size: 12px;
  font-weight: 700;
  font-family: Roboto Mono;
  color: ${theme.color.green2};
`

export const TitleText = styled(Text)`
  font-size: 24px;
  font-weight: 600;
  line-height: 29px;
  -webkit-text-stroke: 0.5px  rgba(0, 0, 0, 0.5);
`;