import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const PanelContainer = styled(Flex)`
  flex-direction: column;
  width: 100%;
  border: 1px solid ${theme.color.darkBlue};
  border-radius: 8px;
  overflow: hidden;
`;

export const OutcomeRow = styled(Flex)<{ $selected?: boolean }>`
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  background: ${({ $selected }) =>
    $selected ? theme.color.grey4 : "transparent"};
  border-bottom: 1px solid ${theme.color.darkBlue};
  transition: background 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${theme.color.grey4};
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
  color: ${theme.color.white};
  min-width: 48px;
  text-align: right;
`;

export const YesButton = styled.button<{ $active?: boolean }>`
  padding: 6px 16px;
  border-radius: 4px;
  border: 1px solid ${theme.color.green2};
  background: ${({ $active }) =>
    $active ? theme.color.green2 : "transparent"};
  color: ${({ $active }) =>
    $active ? theme.color.background : theme.color.green2};
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${theme.color.green2};
    color: ${theme.color.background};
  }
`;

export const NoButton = styled.button<{ $active?: boolean }>`
  padding: 6px 16px;
  border-radius: 4px;
  border: 1px solid ${theme.color.red2};
  background: ${({ $active }) =>
    $active ? theme.color.red2 : "transparent"};
  color: ${({ $active }) =>
    $active ? theme.color.background : theme.color.red2};
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${theme.color.red2};
    color: ${theme.color.background};
  }
`;

