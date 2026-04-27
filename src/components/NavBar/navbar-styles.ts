import { Box, Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const TopNavShell = styled(Box)`
  position: sticky;
  top: 0;
  z-index: 12;
  width: 100%;
  height: ${theme.headerSize.mobileHeight};
  background: #050607;
  border-bottom: 1px solid ${theme.semantic.borderMuted};

  @media (min-width: ${theme.breakpoints.sm}) {
    height: ${theme.headerSize.height};
  }
`;

export const BrandButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 100%;
  min-width: 156px;
  padding: 0 24px 0 18px;
  border: 0;
  border-right: 1px solid ${theme.semantic.borderMuted};
  background: transparent;
  color: ${theme.semantic.textPrimary};
  cursor: pointer;

  &:hover {
    background: ${theme.semantic.hover};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: -2px;
  }
`;

export const BrandText = styled.span`
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 0;

  @media (max-width: 520px) {
    display: none;
  }
`;

export const LinksWrapper = styled(Flex)`
  position: absolute;
  left: -9999px;

  @media (min-width: ${theme.breakpoints.sm}) {
    position: static;
    height: 100%;
    padding-right: 330px;
  }
`;

export const MobileNavBarContainer = styled(Box)`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 73px;
  padding: 8px 16px;
  position: fixed;
  bottom: 0;
  background: rgba(5, 6, 7, 0.94);
  z-index: 1000;
  border-top: 1px solid ${theme.semantic.border};
  box-shadow: 0 -12px 30px rgba(0, 0, 0, 0.38);
  backdrop-filter: blur(12px);
  left: 0;

  @media (min-width: ${theme.breakpoints.sm}) {
    display: none;
  }
`;
