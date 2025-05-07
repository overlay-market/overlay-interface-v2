import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const HeaderContainer = styled(Flex)`
  height: ${theme.headerSize.height};
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 10px;
`;

export const MarketHeaderContainer = styled(Flex)`
  height: 50px;
  width: 100%;
  justify-content: space-between;

  @media (max-width: 767px) {
    display: none;
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    height: ${theme.headerSize.height};
    border-bottom: 1px solid ${theme.color.darkBlue};
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    justify-content: start;
  }
`;

export const StyledFlex = styled(Flex)`
  height: 100%;
  flex-direction: column;
  color: ${({ theme }) => theme.color.white};
  font-size: 14px;
  font-weight: 500;

  @media (min-width: ${theme.breakpoints.sm}) {
    border-right: 1px solid ${theme.color.darkBlue};
  }
`;

export const TabsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 10px; /* Add margin to separate tabs from header text */
  flex-direction: row; /* Ensure tabs are in a row */
`;

export const Tab = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  background: ${({ active }) => (active ? "#e0c89b" : "#333")};
  border: none;
  color: ${({ active }) => (active ? "#333" : "#fff")};
  font-size: 16px;
  font-weight: ${({ active }) => (active ? "600" : "500")};
  cursor: pointer;
  transition: all 0.2s ease;
`;

export const LineSeparator = styled(Flex)`
  @media (min-width: ${theme.breakpoints.sm}) {
    height: 0;
    width: calc(100% - ${theme.headerSize.tabletWidth});
    position: absolute;
    top: ${theme.headerSize.height};
    left: ${theme.headerSize.tabletWidth};
    border-bottom: 1px solid ${theme.color.darkBlue};
  }

  @media (min-width: ${theme.breakpoints.md}) {
    width: calc(100% - ${theme.headerSize.width});
    left: ${theme.headerSize.width};
  }
`;
