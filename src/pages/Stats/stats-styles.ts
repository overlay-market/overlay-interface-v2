import styled from "styled-components";
import theme from "../../theme";

export const StatsPageShell = styled.main`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  min-height: calc(100vh - ${theme.headerSize.height});
  padding: 12px 12px calc(88px + env(safe-area-inset-bottom));
  overflow-x: hidden;
  background: linear-gradient(180deg, #070809 0%, #050607 46%);
  color: ${theme.semantic.textPrimary};

  @media (min-width: ${theme.breakpoints.sm}) {
    gap: 16px;
    padding: 16px 16px 28px;
  }
`;

export const HeaderPanel = styled.section`
  display: grid;
  gap: 16px;
  width: 100%;
  min-width: 0;
  padding: 16px;
  border: 1px solid ${theme.semantic.borderMuted};
  border-radius: ${theme.radius.md};
  background: linear-gradient(180deg, rgba(16, 17, 20, 0.94), rgba(8, 9, 10, 0.98));

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
    padding: 18px;
  }
`;

export const TitleGroup = styled.div`
  min-width: 0;
`;

export const Eyebrow = styled.div`
  color: ${theme.semantic.textMuted};
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  margin: 4px 0 0;
  color: ${theme.semantic.textPrimary};
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0;

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: 44px;
  }
`;

export const Subtitle = styled.p`
  max-width: 620px;
  margin: 10px 0 0;
  color: ${theme.semantic.textSecondary};
  font-size: 13px;
  font-weight: 600;
  line-height: 1.45;
`;

export const StatusGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;

  @media (min-width: ${theme.breakpoints.md}) {
    justify-content: end;
  }
`;

export const StatusPill = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  max-width: 100%;
  padding: 0 10px;
  border: 1px solid ${theme.semantic.border};
  border-radius: 999px;
  background: ${theme.semantic.field};
  color: ${theme.semantic.textSecondary};
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
`;

export const SummaryGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 10px;
  width: 100%;

  @media (min-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

export const SummaryCard = styled.article`
  display: grid;
  gap: 8px;
  min-width: 0;
  min-height: 116px;
  padding: 14px;
  border: 1px solid ${theme.semantic.border};
  border-radius: ${theme.radius.md};
  background: ${theme.semantic.panel};
`;

export const SummaryLabel = styled.div`
  color: ${theme.semantic.textMuted};
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
`;

export const SummaryValue = styled.div`
  min-width: 0;
  color: ${theme.semantic.textPrimary};
  font-size: 28px;
  font-weight: 900;
  line-height: 1;
  overflow-wrap: anywhere;

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: 32px;
  }
`;

export const SummaryMeta = styled.div`
  align-self: end;
  color: ${theme.semantic.textSecondary};
  font-size: 12px;
  font-weight: 700;
`;

export const ChartGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  width: 100%;

  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const ChartPanel = styled.article`
  display: grid;
  grid-template-rows: auto minmax(280px, 1fr);
  gap: 12px;
  min-width: 0;
  min-height: 380px;
  padding: 14px;
  border: 1px solid ${theme.semantic.border};
  border-radius: ${theme.radius.md};
  background: ${theme.semantic.panel};

  @media (min-width: ${theme.breakpoints.sm}) {
    min-height: 430px;
    padding: 16px;
  }
`;

export const ChartHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
`;

export const ChartTitleGroup = styled.div`
  min-width: 0;
`;

export const ChartTitle = styled.h2`
  margin: 0;
  color: ${theme.semantic.textPrimary};
  font-size: 18px;
  font-weight: 900;
  line-height: 1.15;
`;

export const ChartMeta = styled.div`
  margin-top: 4px;
  color: ${theme.semantic.textMuted};
  font-size: 12px;
  font-weight: 700;
`;

export const Legend = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
  color: ${theme.semantic.textSecondary};
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;

  &::before {
    content: "";
    width: 14px;
    height: 3px;
    border-radius: 999px;
    background: ${({ $color }) => $color};
  }
`;

export const ChartBody = styled.div`
  min-width: 0;
  min-height: 280px;

  .recharts-surface {
    overflow: visible;
  }
`;

export const EmptyState = styled.div`
  display: grid;
  place-items: center;
  min-height: 280px;
  border: 1px dashed ${theme.semantic.border};
  border-radius: ${theme.radius.md};
  color: ${theme.semantic.textMuted};
  font-size: 13px;
  font-weight: 800;
`;

export const TooltipShell = styled.div`
  display: grid;
  gap: 6px;
  min-width: 150px;
  padding: 8px 10px;
  border: 1px solid ${theme.semantic.border};
  border-radius: ${theme.tooltip.borderRadius};
  background: ${theme.tooltip.background};
  box-shadow: ${theme.shadow.popover};
`;

export const TooltipLabel = styled.div`
  color: ${theme.semantic.textMuted};
  font-size: 12px;
  font-weight: 800;
`;

export const TooltipValue = styled.div`
  color: ${theme.semantic.textPrimary};
  font-size: 14px;
  font-weight: 900;
`;

export const ErrorPanel = styled.div`
  padding: 14px;
  border: 1px solid rgba(240, 68, 94, 0.32);
  border-radius: ${theme.radius.md};
  background: ${theme.semantic.negativeSoft};
  color: ${theme.semantic.textPrimary};
  font-size: 13px;
  font-weight: 700;
`;
