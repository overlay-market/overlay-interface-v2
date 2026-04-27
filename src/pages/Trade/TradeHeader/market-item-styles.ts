import { Box } from "@radix-ui/themes";
import  theme  from "../../../theme";
import styled from "styled-components";

export const MarketInfo = styled.button`
  width: 100%;
  height: 49px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  border: 0;
  border-bottom: 1px solid ${theme.semantic.border};
  background: transparent;
  color: ${theme.semantic.textSecondary};
  cursor: pointer;
  text-align: left;

  @media (min-width: ${theme.breakpoints.xxl}) {
    padding: 12px 8px 12px 16px;
  }

  &:hover {
    background: ${theme.semantic.hover};
    color: ${theme.semantic.textPrimary};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: -2px;
  }
`;

export const MarketName = styled(Box)`
  max-width: calc(100% - 90px); 
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  text-align: left;
`;

export const MarketPrice = styled(Box)`
  width: 90px; 
  text-align: right;
  flex-shrink: 0;
`;

export const MarketLogo = styled.img`
  width: 34px;
  height: 34px;
  object-fit: cover;
  border-radius: ${theme.radius.sm};
  border: 1px solid ${theme.semantic.border};
  box-shadow: none;
`;
