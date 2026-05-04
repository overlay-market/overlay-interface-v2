import styled from "styled-components";
import theme from "../../theme";

export const MarketsPageShell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  min-height: calc(100vh - ${theme.headerSize.height});
  padding: 12px 12px calc(88px + env(safe-area-inset-bottom));
  overflow-x: hidden;
  background:
    radial-gradient(circle at 10% 0%, rgba(243, 169, 27, 0.08), transparent 30%),
    linear-gradient(180deg, #070809 0%, #050607 42%);
  color: ${theme.semantic.textPrimary};

  @media (min-width: ${theme.breakpoints.sm}) {
    gap: 14px;
    padding: 16px 16px 28px;
  }
`;

export const MarketsHeroPanel = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  min-width: 0;
  border: 1px solid ${theme.semantic.borderMuted};
  border-radius: ${theme.radius.md};
  background:
    linear-gradient(180deg, rgba(16, 17, 20, 0.94), rgba(8, 9, 10, 0.98)),
    radial-gradient(circle at 100% 0%, rgba(40, 209, 154, 0.08), transparent 36%);
  overflow: hidden;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1.36fr) minmax(260px, 0.64fr);
  }
`;

export const MarketsHeroMain = styled.div`
  display: grid;
  gap: 14px;
  min-width: 0;
  padding: 16px;

  @media (min-width: ${theme.breakpoints.md}) {
    padding: 18px;
  }
`;

export const MarketsHeroTop = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
`;

export const MarketsTitleGroup = styled.div`
  min-width: 0;
`;

export const MarketsEyebrow = styled.div`
  color: ${theme.semantic.textMuted};
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
`;

export const MarketsTitle = styled.h1`
  margin: 4px 0 0;
  color: ${theme.semantic.textPrimary};
  font-size: clamp(28px, 5vw, 54px);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: 0;
`;

export const MarketsSubtitle = styled.p`
  max-width: 560px;
  margin: 10px 0 0;
  color: ${theme.semantic.textSecondary};
  font-size: 13px;
  font-weight: 600;
  line-height: 1.45;
`;

export const MarketsStatusPill = styled.div`
  display: none;
  align-items: center;
  gap: 8px;
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid rgba(40, 209, 154, 0.22);
  border-radius: 999px;
  background: rgba(40, 209, 154, 0.08);
  color: ${theme.semantic.positive};
  font-size: 11px;
  font-weight: 900;
  white-space: nowrap;

  &::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: ${theme.semantic.positive};
    box-shadow: 0 0 16px rgba(40, 209, 154, 0.7);
  }

  @media (min-width: ${theme.breakpoints.sm}) {
    display: inline-flex;
  }
`;

export const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 10px;

  @media (min-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const FeaturedMarketCard = styled.button<{ $image?: string; $muted?: boolean }>`
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 156px;
  align-items: flex-end;
  overflow: hidden;
  padding: 14px;
  border: 1px solid ${theme.semantic.border};
  border-radius: ${theme.radius.md};
  background:
    linear-gradient(90deg, rgba(5, 6, 7, 0.92), rgba(5, 6, 7, 0.46) 58%, rgba(5, 6, 7, 0.78)),
    ${({ $image }) => ($image ? `url(${$image})` : theme.semantic.panelRaised)};
  background-size: cover;
  background-position: center;
  color: ${theme.semantic.textPrimary};
  text-align: left;
  cursor: ${({ $muted }) => ($muted ? "default" : "pointer")};
  filter: ${({ $muted }) => ($muted ? "grayscale(1) brightness(0.7)" : "none")};
  transition: transform 0.16s ease, border-color 0.16s ease;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 24%),
      radial-gradient(circle at 0% 100%, rgba(243, 169, 27, 0.16), transparent 36%);
    pointer-events: none;
  }

  &:not(:disabled):hover {
    transform: translateY(-1px);
    border-color: ${theme.semantic.accent};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: 2px;
  }
`;

export const FeaturedContent = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  gap: 8px;
  min-width: 0;
`;

export const FeaturedMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

export const FeaturedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 7px;
  border: 1px solid rgba(243, 169, 27, 0.24);
  border-radius: ${theme.radius.xs};
  background: rgba(243, 169, 27, 0.14);
  color: ${theme.semantic.accent};
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
`;

export const FeaturedName = styled.div`
  max-width: 100%;
  color: ${theme.semantic.textPrimary};
  font-size: clamp(18px, 3vw, 28px);
  font-weight: 900;
  line-height: 1.02;
  overflow-wrap: anywhere;
`;

export const FeaturedPrice = styled.div<{ $tone?: "positive" | "negative" }>`
  color: ${({ $tone }) =>
    $tone === "negative" ? theme.semantic.negative : theme.semantic.positive};
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
  font-size: 15px;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
`;

export const MarketsStatsPanel = styled.aside`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  min-width: 0;
  border-top: 1px solid ${theme.semantic.borderMuted};
  background: ${theme.semantic.borderMuted};

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1fr);
    border-top: 0;
    border-left: 1px solid ${theme.semantic.borderMuted};
  }
`;

export const MarketsStatCard = styled.div`
  min-width: 0;
  padding: 14px;
  background: #090a0c;

  @media (min-width: ${theme.breakpoints.md}) {
    padding: 16px;
  }
`;

export const StatLabel = styled.div`
  color: ${theme.semantic.textMuted};
  font-size: 11px;
  font-weight: 800;
`;

export const StatValue = styled.div`
  margin-top: 8px;
  color: ${theme.semantic.textPrimary};
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
  font-size: clamp(18px, 2.5vw, 28px);
  font-weight: 900;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const MarketRailPanel = styled.section`
  min-width: 0;
  border: 1px solid ${theme.semantic.borderMuted};
  border-radius: ${theme.radius.md};
  background: #08090a;
  overflow: hidden;
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 42px;
  padding: 0 14px;
  border-bottom: 1px solid ${theme.semantic.borderMuted};
  background: #090a0c;
`;

export const PanelTitle = styled.h2`
  margin: 0;
  color: ${theme.semantic.textPrimary};
  font-size: 13px;
  font-weight: 900;
`;

export const PanelMeta = styled.span`
  color: ${theme.semantic.textMuted};
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
  font-size: 11px;
  font-weight: 800;
`;

export const MarketRailScroller = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(180px, 220px);
  gap: 1px;
  overflow-x: auto;
  background: ${theme.semantic.borderMuted};
  scrollbar-width: thin;
  scrollbar-color: ${theme.semantic.border} transparent;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${theme.semantic.border};
  }
`;

export const RailMarketButton = styled.button<{ $disabled?: boolean }>`
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  min-width: 0;
  min-height: 72px;
  padding: 10px;
  border: 0;
  background: #0b0c0e;
  color: ${theme.semantic.textPrimary};
  text-align: left;
  cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.62 : 1)};

  &:not(:disabled):hover {
    background: ${theme.semantic.hover};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: -2px;
  }
`;

export const RailLogo = styled.img`
  width: 32px;
  height: 32px;
  border: 1px solid ${theme.semantic.border};
  border-radius: 999px;
  object-fit: cover;
`;

export const RailText = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
`;

export const RailName = styled.div`
  color: ${theme.semantic.textPrimary};
  font-size: 12px;
  font-weight: 900;
  line-height: 1.05;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const RailDetails = styled.div<{ $tone?: "positive" | "negative" }>`
  color: ${({ $tone }) =>
    $tone === "negative" ? theme.semantic.negative : theme.semantic.positive};
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
  font-size: 11px;
  font-weight: 800;
`;
