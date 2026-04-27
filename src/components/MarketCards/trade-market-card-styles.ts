import { Flex, Text } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const CustomCard = styled(Flex)`
  display: flex;
  flex-direction: column;
  width: 172px;
  height: 273px;
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.semantic.border};
  background-color: ${theme.semantic.panel};
  cursor: pointer;
  overflow: hidden;
  box-shadow: none;
  transition: transform 0.16s ease, border-color 0.16s ease, background 0.16s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${theme.semantic.accent};
    background: ${theme.semantic.panelRaised};
  }
`;

export const CardImg = styled(Flex)`
  width: 100%;
  height: 97px;
  min-height: 97px;
  background-size: cover;
  background-position: center;
  
`;

export const MarketTitle = styled(Text)`
  color: ${theme.color.white};
  line-height: 16px;
  letter-spacing: 0;  
`;

export const MarketDescription = styled(Text)<{lineclamp?: number}>`
  color: ${theme.semantic.textMuted};
  line-height: 16.8px;
  display: -webkit-box;
  -webkit-line-clamp: ${({ lineclamp }) => lineclamp};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
