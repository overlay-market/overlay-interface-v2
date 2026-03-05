import styled from "styled-components";
import theme from "../../../theme";
import { Flex } from "@radix-ui/themes";

export const MarketsLogos = styled.img`
  width: 36px;
  height: 36px;
  object-fit: cover;
  border-radius: 20%;
  border: 1px solid rgba(236, 236, 236, 0.15);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  @media (min-width: ${theme.breakpoints.md}) {
    width: 62px;
    height: 62px;
  }
`;

export const CategoryBarWrapper = styled(Flex)`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #2B3139;
`;

export const CategoriesBar = styled(Flex)`
  gap: 8px;
  align-items: center;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 12px 16px;
  scrollbar-width: none;
  width: 100%;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ScrollIndicator = styled.button<{
  $visible: boolean;
  $side: "left" | "right";
}>`
  all: unset;
  position: absolute;
  ${({ $side }) => ($side === "left" ? "left: 0;" : "right: 0;")}
  top: 0;
  bottom: 0;
  width: 40px;
  background: ${({ $side }) =>
    $side === "left"
      ? `linear-gradient(270deg, transparent, ${theme.color.background} 80%)`
      : `linear-gradient(90deg, transparent, ${theme.color.background} 80%)`};
  display: ${({ $visible }) => ($visible ? "flex" : "none")};
  align-items: center;
  justify-content: ${({ $side }) =>
    $side === "left" ? "flex-start" : "flex-end"};
  padding-${({ $side }) => ($side === "left" ? "left" : "right")}: 8px;
  pointer-events: auto;
  color: #848e9c;
  z-index: 10;
  transition: color 0.2s ease;
  cursor: pointer;

  &:hover {
    color: ${theme.color.white};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    display: none !important;
  }
`;

export const CategoryButton = styled.button<{ $active: boolean }>`
  all: unset;
  cursor: pointer;
  padding: 6px 14px;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? "#2B3139" : "transparent")};
  color: ${({ $active }) => ($active ? theme.color.white1 : "#848E9C")};
  font-size: 14px;
  font-weight: 500;
  position: relative;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    color: ${theme.color.white1};
    background: ${({ $active }) => ($active ? "#2B3139" : "#1E2329")};
  }

  &:focus-visible {
    outline: 1px solid ${theme.color.grey3};
    outline-offset: 4px;
    border-radius: 6px;
  }
`;

export const NewBadge = styled.span`
  background-color: #FCD535;
  color: #000000;
  font-size: 9px;
  font-weight: 700;
  padding: 1px 4px;
  border-radius: 2px;
  position: absolute;
  top: -6px;
  right: 0px;
  line-height: normal;
  text-transform: uppercase;
`;
