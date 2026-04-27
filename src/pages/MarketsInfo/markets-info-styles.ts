import { Box, Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const PageWrapper = styled(Flex)`
  width: 100%;
  min-width: 0;
  flex-direction: column;
  gap: 24px;
  padding: 24px 0 40px;

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 28px 0 48px 24px;
  }

  @media (min-width: ${theme.breakpoints.md}) {
    padding: 32px 0 56px 32px;
  }
`;

export const HeroCard = styled(Box)`
  border: 1px solid ${theme.semantic.border};
  border-radius: ${theme.radius.md};
  padding: 24px;
  background:
    radial-gradient(circle at top right, rgba(243, 169, 27, 0.12), transparent 30%),
    ${theme.semantic.panel};

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 28px;
  }
`;

export const AccentText = styled.span`
  background: ${theme.gradient.accentText};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 12px;
  margin-top: 20px;

  @media (min-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const StatCard = styled(Box)`
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.semantic.border};
  background: ${theme.semantic.bgElevated};
  padding: 16px;
`;

export const TableCard = styled(Box)`
  border: 1px solid ${theme.semantic.border};
  border-radius: ${theme.radius.md};
  padding: 20px;
  background: ${theme.semantic.panel};

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 24px;
  }
`;

export const EmptyState = styled(Flex)`
  min-height: 240px;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px dashed ${theme.semantic.border};
  border-radius: ${theme.radius.md};
  background: ${theme.semantic.bgElevated};
  padding: 24px;
`;

export const DataRow = styled.tr`
  border-bottom: 1px solid ${theme.semantic.borderMuted};

  &:hover {
    background-color: ${theme.semantic.hover};
  }
`;

export const DataCell = styled.td`
  padding: 16px 0;
  text-align: left;
  vertical-align: middle;
`;
