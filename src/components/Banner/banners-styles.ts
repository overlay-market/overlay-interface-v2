import styled, { css } from "styled-components";
import { Flex, Text } from "@radix-ui/themes";
import theme from "../../theme";
import { Link } from "react-router-dom";
import { ExternalLinkIcon } from "@radix-ui/react-icons";

const baseBannerStyles = css`
  position: relative;
  width: 100%;
  min-height: 156px;
  height: auto;
  background-color: ${theme.semantic.panel};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 16px;
  color: ${theme.semantic.textPrimary};
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.semantic.border};
  box-shadow: none;
  overflow: hidden;

  @media (max-width: 768px) {
    min-height: 132px;
    padding: 14px;
  }

  @media (max-width: 480px) {
    min-height: 120px;
    padding: 12px;
  }
`;

const BaseBanner = styled(Flex)`
  ${baseBannerStyles}
`;

export const StyledOptionalLinkBanner = styled(BaseBanner)`
  border-bottom-right-radius: ${theme.radius.md};

  @media (max-width: 768px) {
    border-bottom-right-radius: ${theme.radius.md};
  }

  @media (max-width: 480px) {
    border-bottom-right-radius: ${theme.radius.md};
  }
`;

export const StyledPromotedBanner = styled.button`
  ${baseBannerStyles}
  cursor: pointer;
  text-align: left;
  transition: border-color 0.16s ease, transform 0.16s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background:
      linear-gradient(90deg, rgba(5, 6, 7, 0.84), rgba(5, 6, 7, 0.32) 54%, rgba(5, 6, 7, 0.52)),
      linear-gradient(180deg, rgba(5, 6, 7, 0.05), rgba(5, 6, 7, 0.7));
    pointer-events: none;
  }

  &:hover {
    border-color: ${theme.semantic.accent};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: 2px;
  }
`;

export const TitleText = styled(Text)`
  font-size: clamp(16px, 2vw, 22px);
  font-weight: 600;
  color: ${theme.semantic.textPrimary};
`;

export const SubtitleText = styled(Text)`
  font-size: 11px;
  font-weight: 500;
  color: ${theme.semantic.textMuted};
  text-transform: uppercase;
`;

export const CardsValue = styled.h2`
  margin: 0;
  font-size: clamp(14px, 2vw, 18px);
  color: ${theme.semantic.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;

export const LinkText = styled(Link)`
  display: flex;
  align-items: center;
  font-size: clamp(14px, 3vw, 18px);
  color: ${theme.color.black2};
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

export const LinkIcon = styled(ExternalLinkIcon)`
  margin: 2 0 0 4;
`;
