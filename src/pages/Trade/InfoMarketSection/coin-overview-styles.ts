import styled from "styled-components";
import theme from "../../../theme";

export const OverviewShell = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  min-height: 100%;
  color: ${theme.semantic.textPrimary};

  @container (min-width: 980px) {
    grid-template-columns: minmax(0, 1fr) minmax(290px, 330px);
    align-items: start;
  }
`;

export const DossierPanel = styled.article`
  container-type: inline-size;
  min-width: 0;
  overflow: hidden;
  border: 1px solid ${theme.semantic.borderMuted};
  border-radius: ${theme.radius.md};
  background:
    linear-gradient(180deg, rgba(21, 23, 27, 0.92), rgba(8, 9, 10, 0.96)),
    radial-gradient(circle at 80% 0%, rgba(243, 169, 27, 0.08), transparent 34%);
`;

export const DossierTop = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 14px;
  padding: 14px;
  border-bottom: 1px solid ${theme.semantic.borderMuted};

  @container (min-width: 520px) {
    grid-template-columns: 148px minmax(0, 1fr);
    gap: 18px;
    padding: 18px;
  }
`;

export const LogoFrame = styled.div`
  position: relative;
  width: min(100%, 156px);
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid ${theme.semantic.border};
  border-radius: ${theme.radius.md};
  background: #070809;
`;

export const MarketLogo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(1.08) contrast(1.05);
`;

export const LogoOverlay = styled.div`
  position: absolute;
  inset: auto 10px 10px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const SmallLogo = styled.img`
  width: 28px;
  height: 28px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: #070809;
`;

export const LeverageBadge = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 3px 8px;
  border: 1px solid rgba(243, 169, 27, 0.24);
  border-radius: ${theme.radius.xs};
  background: rgba(243, 169, 27, 0.13);
  color: ${theme.semantic.accent};
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
`;

export const DossierHeader = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 12px;
`;

export const Eyebrow = styled.div`
  color: ${theme.semantic.textMuted};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
`;

export const MarketTitleRow = styled.div`
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
`;

export const MarketTitle = styled.h2`
  min-width: 0;
  margin: 0;
  color: ${theme.semantic.textPrimary};
  font-size: 24px;
  font-weight: 900;
  line-height: 1;
  overflow-wrap: anywhere;

  @container (min-width: 720px) {
    font-size: 34px;
  }
`;

export const MarketAddress = styled.div`
  width: fit-content;
  max-width: 100%;
  padding: 6px 8px;
  border: 1px solid ${theme.semantic.borderMuted};
  border-radius: ${theme.radius.xs};
  background: rgba(7, 8, 9, 0.72);
  color: ${theme.semantic.textMuted};
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const LeadText = styled.p`
  max-width: 820px;
  margin: 0;
  color: ${theme.semantic.textSecondary};
  font-size: 14px;
  font-weight: 650;
  line-height: 1.55;
`;

export const FactGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1px;
  overflow: hidden;
  border: 1px solid ${theme.semantic.borderMuted};
  border-radius: ${theme.radius.md};
  background: ${theme.semantic.borderMuted};

  @container (min-width: 520px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @container (min-width: 800px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

export const FactCell = styled.div`
  min-width: 0;
  padding: 12px;
  background: rgba(10, 11, 13, 0.96);
`;

export const FactLabel = styled.div`
  margin-bottom: 7px;
  color: ${theme.semantic.textMuted};
  font-size: 11px;
  font-weight: 700;
`;

export const FactValue = styled.div<{ $tone?: "positive" | "negative" }>`
  min-width: 0;
  color: ${({ $tone }) => {
    if ($tone === "positive") return theme.semantic.positive;
    if ($tone === "negative") return theme.semantic.negative;
    return theme.semantic.textPrimary;
  }};
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
  font-size: 15px;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DescriptionGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  padding: 14px;

  @container (min-width: 760px) {
    grid-template-columns: minmax(0, 1fr) 250px;
    padding: 18px;
  }
`;

export const NarrativePanel = styled.section`
  min-width: 0;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
`;

export const SectionTitle = styled.h3`
  margin: 0;
  color: ${theme.semantic.textPrimary};
  font-size: 13px;
  font-weight: 900;
`;

export const DescriptionText = styled.div`
  color: ${theme.semantic.textSecondary};
  font-size: 13px;
  line-height: 1.65;

  p {
    margin: 0 0 12px;
  }

  p:last-child {
    margin-bottom: 0;
  }

  a {
    color: ${theme.semantic.accentHover};
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

export const MicroPanel = styled.aside`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 12px;
`;

export const OiPanel = styled.div`
  padding: 12px;
  border: 1px solid ${theme.semantic.borderMuted};
  border-radius: ${theme.radius.md};
  background: rgba(10, 11, 13, 0.86);
`;

export const BarTrack = styled.div`
  display: flex;
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: ${theme.semantic.field};
`;

export const BarSegment = styled.div<{ $side: "long" | "short"; $width: number }>`
  width: ${({ $width }) => `${$width}%`};
  min-width: ${({ $width }) => ($width > 0 ? "4px" : "0")};
  background: ${({ $side }) =>
    $side === "long" ? theme.semantic.positive : theme.semantic.negative};
`;

export const OiRows = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 12px;
`;

export const OiRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: ${theme.semantic.textMuted};
  font-size: 12px;
`;

export const OiValue = styled.span`
  color: ${theme.semantic.textPrimary};
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
  text-align: right;
`;

export const StatRail = styled.aside`
  display: grid;
  gap: 12px;
  min-width: 0;
`;

export const StatCard = styled.div`
  min-width: 0;
  padding: 16px;
  border: 1px solid ${theme.semantic.borderMuted};
  border-radius: ${theme.radius.md};
  background:
    linear-gradient(180deg, rgba(21, 23, 27, 0.92), rgba(10, 11, 13, 0.95)),
    radial-gradient(circle at 100% 0%, rgba(243, 169, 27, 0.07), transparent 42%);
`;

export const StatLabel = styled.div`
  color: ${theme.semantic.textSecondary};
  font-size: 12px;
  font-weight: 800;
`;

export const StatValue = styled.div`
  margin-top: 12px;
  color: ${theme.semantic.textPrimary};
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
  font-size: 28px;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (min-width: ${theme.breakpoints.md}) {
    font-size: 34px;
  }
`;

export const StatCaption = styled.div`
  margin-top: 8px;
  color: ${theme.semantic.textMuted};
  font-size: 11px;
`;
