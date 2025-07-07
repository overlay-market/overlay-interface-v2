import { Flex, Text } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

interface RewardCardProps {
  src: string;
  bgposition: string;
  height?: { initial: string; sm: string; lg: string};
}

export const RewardCard = styled(Flex)<RewardCardProps>`
  position: relative;
  justify-content: space-between;
  width: 100%;
  padding: 12px;
  border-radius: 20px;
  overflow: hidden;
  z-index: 1; 
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.25);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${(props) => props.src});
    background-position: ${(props) => props.bgposition};
    background-size: cover;
    opacity: 0.45; 
    z-index: -1; 
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 16px;
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    height: ${(props) => (props.height ? props.height : `91px`)};
  }
`

export const TitleText = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  line-height: 21px;
  text-shadow: 
    -0.5px -0.5px 0 rgba(0, 0, 0, 0.2), 
    0.5px -0.5px 0 rgba(0, 0, 0, 0.2), 
    -0.5px  0.5px 0 rgba(0, 0, 0, 0.2), 
    0.5px  0.5px 0 rgba(0, 0, 0, 0.2);

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: 24px;
    line-height: 29px;
  }
`;

export const ApyBadge = styled(Flex)`
  align-items: center;
  padding: 3px 8px;
  border-radius: 16px;
  height: 23px;
  background: ${theme.color.green2}20;
`

export const ApyBagdeText = styled(Text)`
  font-size: 12px;
  font-weight: 700;
  font-family: Roboto Mono;
  color: ${theme.color.green2};
`
