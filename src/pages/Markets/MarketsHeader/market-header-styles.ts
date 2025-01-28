import styled from "styled-components";
import theme from "../../../theme";
import { Flex, Text } from "@radix-ui/themes";

interface SupplyChangeTextProps {
  $changeColor: "green" | "red" | "default";
}

export const MarketHeaderContainer = styled(Flex)`
  height: 50px;
  width: 100%;
  justify-content: space-between;

  @media (max-width: 767px) {
    display: none;
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    height: ${theme.headerSize.height};
    width: calc(100% + ${theme.app.rightPadding});
    margin-right: calc(0px - ${theme.app.rightPadding});
    border-bottom: 1px solid ${theme.color.darkBlue};
  }

  @media (min-width: ${theme.breakpoints.md}) {
    width: calc(100% + 10px);
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    justify-content: start;
  }

  @media (min-width: ${theme.breakpoints.xxl}) {
    margin-left: calc(16px - ${theme.app.xxlPadding});
    width: calc(100% + 2 * ${theme.app.xxlPadding} - 16px);
  }
`;

export const StyledFlex = styled(Flex)`
  height: 100%;
  flex-direction: column;
  text-align: end;
  padding: 12px;

  @media (min-width: ${theme.breakpoints.sm}) {
    border-right: 1px solid ${theme.color.darkBlue};
  }
`;

export const StyledText = styled.div`
  font-size: 10px;
  font-weight: 300;
`;

export const SupplyChangeText = styled(Text)<SupplyChangeTextProps>`
  color: ${({ $changeColor }) => {
    switch ($changeColor) {
      case "green":
        return theme.color.green1;
      case "red":
        return theme.color.red1;
      default:
        return "inherit";
    }
  }};
`;
