import { styled } from "styled-components";
import theme from "../../theme";
import { Flex } from "@radix-ui/themes";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  @media (min-width: ${theme.breakpoints.xxl}) {
    padding-left: ${theme.app.xxlPadding};
  }
`;

export const PowercardsContent = styled(Flex)`
  flex-direction: column;
  padding-top: 16px;

  @media (min-width: ${theme.breakpoints.sm}) {
    padding-left: 16px;
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    padding-top: 12px;
  }

  @media (min-width: ${theme.breakpoints.xxl}) {
    padding-left: 0;
  }
`;

export const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

export const Tab = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>`
  width: 109px;
  padding: 12px;
  position: relative;
  background: ${({ active, theme }) => (active ? theme.color.grey4 : "none")};
  border: none;
  font-size: 14px;
  font-family: Inter;
  cursor: pointer;
  border: 1px solid ${theme.color.grey4};
  border-radius: 8px;
  color: ${({ active }) => (active ? "transparent" : "white")};

  @media (min-width: ${theme.breakpoints.sm}) {
    width: 120px;
  }

  ${({ active }) =>
    active &&
    `
    &::before {
      content: attr(data-text);
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      background: linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%);
      -webkit-background-clip: text;
      background-clip: text;
    }
  `}
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 0;
  color: ${({ theme }) => theme.text3};
  font-size: 16px;
`;
