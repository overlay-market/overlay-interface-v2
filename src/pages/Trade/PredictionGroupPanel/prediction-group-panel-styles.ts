import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const PanelContainer = styled(Flex)`
  flex-direction: column;
  width: 100%;
  border: 1px solid ${theme.semantic.border};
  border-radius: ${theme.radius.md};
  overflow: hidden;
`;

export const OutcomeRow = styled(Flex)<{ $selected?: boolean }>`
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${({ $selected }) =>
    $selected ? theme.semantic.hover : "transparent"};
  border-bottom: 1px solid ${theme.semantic.border};
  transition: background 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

`;

export const OutcomePrimaryButton = styled.button`
  min-width: 0;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0;
  background: transparent;
  border: 0;
  color: ${theme.semantic.textPrimary};
  cursor: pointer;
  text-align: left;

  &:hover {
    color: ${theme.semantic.accent};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: 3px;
  }
`;

export const OutcomeLogo = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
`;

export const ProbabilityText = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.semantic.textPrimary};
  min-width: 48px;
  text-align: right;
`;

export const YesButton = styled.button<{ $active?: boolean }>`
  padding: 6px 16px;
  border-radius: ${theme.radius.sm};
  border: 1px solid ${theme.semantic.positive};
  background: ${({ $active }) =>
    $active ? theme.semantic.positive : "transparent"};
  color: ${({ $active }) =>
    $active ? theme.color.background : theme.semantic.positive};
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${theme.semantic.positive};
    color: ${theme.color.background};
  }
`;

export const NoButton = styled.button<{ $active?: boolean }>`
  padding: 6px 16px;
  border-radius: ${theme.radius.sm};
  border: 1px solid ${theme.semantic.negative};
  background: ${({ $active }) =>
    $active ? theme.semantic.negative : "transparent"};
  color: ${({ $active }) =>
    $active ? theme.color.background : theme.semantic.negative};
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${theme.semantic.negative};
    color: ${theme.color.background};
  }
`;
