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
  border: 1px solid ${theme.color.darkBlue};
  border-radius: 24px;
  padding: 24px;
  background:
    radial-gradient(circle at top right, rgba(113, 206, 255, 0.14), transparent 30%),
    linear-gradient(180deg, rgba(37, 37, 52, 0.95) 0%, rgba(23, 23, 33, 0.98) 100%);

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 28px;
  }
`;

export const AccentText = styled.span`
  background: linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%);
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
  border-radius: 18px;
  border: 1px solid rgba(57, 69, 107, 0.8);
  background: rgba(23, 23, 33, 0.72);
  padding: 16px;
`;

export const TableCard = styled(Box)`
  border: 1px solid ${theme.color.darkBlue};
  border-radius: 24px;
  padding: 20px;
  background: linear-gradient(180deg, rgba(37, 37, 52, 0.88) 0%, rgba(23, 23, 33, 0.94) 100%);

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 24px;
  }
`;

export const EmptyState = styled(Flex)`
  min-height: 240px;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px dashed ${theme.color.darkBlue};
  border-radius: 18px;
  background: rgba(23, 23, 33, 0.48);
  padding: 24px;
`;

export const DataRow = styled.tr`
  border-bottom: 1px solid ${theme.color.grey6};

  &:hover {
    background-color: rgba(255, 255, 255, 0.02);
  }
`;

export const DataCell = styled.td`
  padding: 16px 0;
  text-align: left;
  vertical-align: middle;
`;
