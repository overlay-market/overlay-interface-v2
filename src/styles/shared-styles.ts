import styled, { css } from 'styled-components';
import { Box, Flex } from '@radix-ui/themes';
import theme from '../theme';

export const focusRing = css`
  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: 2px;
    box-shadow: ${theme.shadow.focus};
  }
`;

export const terminalScrollbars = css`
  scrollbar-color: ${theme.semantic.border} transparent;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${theme.semantic.border};
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${theme.semantic.textMuted};
  }
`;

export const interactiveControl = css`
  appearance: none;
  border: 1px solid ${theme.semantic.border};
  border-radius: ${theme.radius.sm};
  background: ${theme.semantic.field};
  color: ${theme.semantic.textPrimary};
  transition:
    background 0.16s ease,
    border-color 0.16s ease,
    color 0.16s ease,
    box-shadow 0.16s ease;
  ${focusRing}

  &:not(:disabled):hover {
    background: ${theme.semantic.hover};
    border-color: ${theme.semantic.textMuted};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }
`;

export const TerminalPanel = styled(Box)`
  background: ${theme.semantic.panel};
  border: 1px solid ${theme.semantic.border};
  border-radius: ${theme.radius.md};
`;

export const TerminalField = styled(Box)`
  background: ${theme.semantic.field};
  border: 1px solid ${theme.semantic.borderMuted};
  border-radius: ${theme.radius.md};
`;

export const SectionLabel = styled.span`
  color: ${theme.semantic.textMuted};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: uppercase;
`;

export const NumericText = styled.span`
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
  font-variant-numeric: tabular-nums;
`;

export const SegmentedControl = styled(Flex)`
  align-items: center;
  gap: 2px;
  padding: 3px;
  background: ${theme.semantic.field};
  border: 1px solid ${theme.semantic.borderMuted};
  border-radius: ${theme.radius.md};
`;

export const segmentButtonStyles = css<{ $active?: boolean }>`
  ${interactiveControl}
  height: 34px;
  padding: 0 12px;
  border-color: ${({ $active }) =>
    $active ? theme.semantic.accent : 'transparent'};
  background: ${({ $active }) =>
    $active ? theme.semantic.hover : 'transparent'};
  color: ${({ $active }) =>
    $active ? theme.semantic.textPrimary : theme.semantic.textMuted};
  cursor: pointer;
  font-weight: 600;
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
