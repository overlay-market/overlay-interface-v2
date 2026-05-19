import styled from "styled-components";
import theme from "../../theme";

export const PageShell = styled.div`
  width: 100%;
  min-height: calc(100vh - ${theme.headerSize.height});
  padding: 12px 12px calc(92px + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, #070809 0%, #050607 48%);
  color: ${theme.semantic.textPrimary};

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 16px 16px 32px;
  }
`;

export const HeroPanel = styled.section`
  display: grid;
  gap: 18px;
  min-width: 0;
  padding: 18px;
  border: 1px solid ${theme.semantic.borderMuted};
  border-radius: ${theme.radius.md};
  background: linear-gradient(180deg, rgba(16, 17, 20, 0.95), rgba(8, 9, 10, 0.98));

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: minmax(0, 1.15fr) minmax(340px, 0.85fr);
    align-items: end;
    padding: 22px;
  }
`;

export const HeroCopy = styled.div`
  min-width: 0;
`;

export const Eyebrow = styled.div`
  color: ${theme.semantic.textMuted};
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
`;

export const HeroTitle = styled.h1`
  margin: 6px 0 0;
  color: ${theme.semantic.textPrimary};
  font-size: clamp(30px, 4vw, 50px);
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0;
`;

export const HeroSubtitle = styled.p`
  max-width: 720px;
  margin: 12px 0 0;
  color: ${theme.semantic.textSecondary};
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
`;

export const ReferralCodeButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-height: 38px;
  margin-top: 16px;
  padding: 0 14px;
  border: 1px solid ${theme.semantic.border};
  border-radius: ${theme.radius.sm};
  background: ${theme.semantic.field};
  color: ${theme.semantic.textPrimary};
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;

  &:hover {
    border-color: ${theme.semantic.textMuted};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: 2px;
  }
`;

export const HeroStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  min-width: 0;
  overflow: hidden;
  border: 1px solid ${theme.semantic.border};
  border-radius: ${theme.radius.md};
  background: ${theme.semantic.borderMuted};
`;

export const HeroStat = styled.div`
  min-width: 0;
  padding: 14px 12px;
  background: ${theme.semantic.bgElevated};
`;

export const HeroStatLabel = styled.div`
  color: ${theme.semantic.textMuted};
  font-size: 10px;
  font-weight: 900;
  line-height: 1.2;
  text-transform: uppercase;
`;

export const HeroStatValue = styled.div`
  margin-top: 8px;
  color: ${theme.semantic.textPrimary};
  font-size: clamp(18px, 2vw, 24px);
  font-weight: 900;
  line-height: 1;
  overflow-wrap: anywhere;
`;

export const InfoStrip = styled.section`
  display: grid;
  gap: 10px;
  margin-top: 12px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

export const InfoItem = styled.div`
  min-width: 0;
  padding: 13px 14px;
  border: 1px solid ${theme.semantic.borderMuted};
  border-radius: ${theme.radius.md};
  background: ${theme.semantic.bgElevated};
`;

export const InfoItemTitle = styled.div`
  color: ${theme.semantic.textPrimary};
  font-size: 13px;
  font-weight: 900;
`;

export const InfoItemText = styled.div`
  margin-top: 6px;
  color: ${theme.semantic.textMuted};
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
`;

export const RoiPanel = styled.section`
  display: grid;
  gap: 10px;
  min-width: 0;
  margin-top: 12px;
  padding: 13px 14px;
  border: 1px solid ${theme.semantic.borderMuted};
  border-radius: ${theme.radius.md};
  background: ${theme.semantic.bgElevated};

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: minmax(210px, 0.6fr) minmax(0, 1fr);
    align-items: center;
  }
`;

export const RoiHeader = styled.div`
  display: grid;
  gap: 5px;
  min-width: 0;
`;

export const RoiTitle = styled.h2`
  margin: 0;
  color: ${theme.semantic.textPrimary};
  font-size: 14px;
  font-weight: 900;
  line-height: 1.2;
`;

export const RoiSubtitle = styled.div`
  color: ${theme.semantic.textMuted};
  font-size: 11px;
  font-weight: 700;
  line-height: 1.4;
`;

export const RoiScale = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  min-width: 0;
  overflow: hidden;
  border: 1px solid ${theme.semantic.borderMuted};
  border-radius: ${theme.radius.sm};
  background: ${theme.semantic.borderMuted};

  @media (max-width: ${theme.breakpoints.xs}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const RoiScaleItem = styled.div`
  min-width: 0;
  padding: 10px 11px;
  background: ${theme.semantic.field};
`;

export const RoiScaleVolume = styled.div`
  color: ${theme.semantic.textMuted};
  font-size: 10px;
  font-weight: 900;
  line-height: 1.2;
  text-transform: uppercase;
`;

export const RoiScaleValue = styled.div`
  margin-top: 6px;
  color: ${theme.semantic.accentHover};
  font-size: 16px;
  font-weight: 900;
  line-height: 1;
  overflow-wrap: anywhere;
`;

export const RoiNote = styled.div`
  min-width: 0;
  color: ${theme.semantic.textMuted};
  font-size: 11px;
  font-weight: 700;
  line-height: 1.4;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-column: 2;
  }
`;

export const PoolsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 20px 0 10px;
`;

export const PoolsTitle = styled.h2`
  margin: 0;
  color: ${theme.semantic.textPrimary};
  font-size: 18px;
  font-weight: 900;
`;

export const PoolsMeta = styled.div`
  color: ${theme.semantic.textMuted};
  font-size: 12px;
  font-weight: 800;
`;

export const PoolsGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;

  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const PoolCard = styled.article`
  display: grid;
  gap: 14px;
  min-width: 0;
  padding: 16px;
  border: 1px solid ${theme.semantic.border};
  border-radius: ${theme.radius.md};
  background: ${theme.semantic.panel};
  box-shadow: ${theme.shadow.panel};
`;

export const PoolTop = styled.div`
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) max-content;
  gap: 12px;
  align-items: center;
  min-width: 0;

  @media (max-width: ${theme.breakpoints.xs}) {
    grid-template-columns: 42px minmax(0, 1fr);
  }
`;

export const PoolLogo = styled.div<{ $image?: string }>`
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border: 1px solid ${theme.semantic.border};
  border-radius: 999px;
  background:
    ${({ $image }) => $image ? `url(${$image}) center / cover no-repeat` : theme.semantic.field};
  color: ${theme.semantic.accentHover};
  font-size: 15px;
  font-weight: 900;
`;

export const PoolIdentity = styled.div`
  min-width: 0;
`;

export const PoolName = styled.h3`
  margin: 0;
  color: ${theme.semantic.textPrimary};
  font-size: 18px;
  font-weight: 900;
  line-height: 1.1;
  overflow-wrap: anywhere;
`;

export const PoolMarket = styled.div`
  margin-top: 5px;
  color: ${theme.semantic.textMuted};
  font-size: 12px;
  font-weight: 700;
  overflow-wrap: anywhere;
`;

export const StatusBadge = styled.div<{ $tone: "open" | "funded" | "expired" | "draft" }>`
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 8px;
  border: 1px solid
    ${({ $tone }) =>
      $tone === "open"
        ? "rgba(40, 209, 154, 0.32)"
        : $tone === "funded"
          ? "rgba(243, 169, 27, 0.38)"
          : $tone === "draft"
            ? theme.semantic.border
            : "rgba(240, 68, 94, 0.36)"};
  border-radius: ${theme.radius.xs};
  background:
    ${({ $tone }) =>
      $tone === "open"
        ? "rgba(40, 209, 154, 0.10)"
        : $tone === "funded"
          ? "rgba(243, 169, 27, 0.12)"
          : $tone === "draft"
            ? theme.semantic.field
            : "rgba(240, 68, 94, 0.10)"};
  color:
    ${({ $tone }) =>
      $tone === "open"
        ? theme.semantic.positive
        : $tone === "funded"
          ? theme.semantic.accentHover
          : $tone === "draft"
            ? theme.semantic.textSecondary
            : theme.semantic.negative};
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;

  @media (max-width: ${theme.breakpoints.xs}) {
    grid-column: 1 / -1;
    width: fit-content;
  }
`;

export const ProgressBlock = styled.div`
  display: grid;
  gap: 8px;
`;

export const ProgressLabels = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: ${theme.semantic.textSecondary};
  font-size: 12px;
  font-weight: 800;
`;

export const ProgressTrack = styled.div`
  position: relative;
  width: 100%;
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: ${theme.semantic.field};
`;

export const ProgressFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => `${Math.max(0, Math.min(100, $percent))}%`};
  height: 100%;
  border-radius: inherit;
  background: ${theme.gradient.accent};
  transition: width 0.2s ease;
`;

export const PoolDetails = styled.div`
  display: grid;
  gap: 8px;
`;

export const DetailRow = styled.div`
  display: grid;
  grid-template-columns: minmax(96px, 0.36fr) minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  min-width: 0;
  padding-top: 8px;
  border-top: 1px solid ${theme.semantic.borderMuted};
`;

export const DetailLabel = styled.div`
  color: ${theme.semantic.textMuted};
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
`;

export const DetailValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 7px;
  min-width: 0;
  color: ${theme.semantic.textSecondary};
  font-size: 12px;
  font-weight: 800;
  text-align: right;
  overflow-wrap: anywhere;
`;

export const IconAction = styled.button`
  display: inline-grid;
  place-items: center;
  flex: 0 0 auto;
  width: 28px;
  height: 28px;
  border: 1px solid ${theme.semantic.border};
  border-radius: ${theme.radius.xs};
  background: ${theme.semantic.field};
  color: ${theme.semantic.textSecondary};
  cursor: pointer;

  &:hover {
    border-color: ${theme.semantic.textMuted};
    color: ${theme.semantic.textPrimary};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: 2px;
  }
`;

export const ContributionForm = styled.div`
  display: grid;
  gap: 10px;
  padding-top: 2px;
`;

export const AmountBox = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: 54px;
  padding: 8px 12px;
  border: 1px solid ${theme.semantic.border};
  border-radius: ${theme.radius.md};
  background: ${theme.semantic.field};
`;

export const TokenSymbol = styled.div`
  color: ${theme.semantic.textPrimary};
  font-size: 13px;
  font-weight: 900;
`;

export const ActionButton = styled.button<{ $variant?: "solid" | "outline" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 46px;
  padding: 0 14px;
  border: 1px solid
    ${({ $variant }) =>
      $variant === "outline" ? theme.semantic.border : theme.semantic.accent};
  border-radius: ${theme.radius.md};
  background:
    ${({ $variant }) =>
      $variant === "outline" ? theme.semantic.field : theme.gradient.accent};
  color: ${({ $variant }) =>
    $variant === "outline" ? theme.semantic.textPrimary : theme.color.black};
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: 2px;
  }
`;

export const HelperText = styled.div<{ $tone?: "error" | "muted" }>`
  min-height: 17px;
  color: ${({ $tone }) =>
    $tone === "error" ? theme.semantic.negative : theme.semantic.textMuted};
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
`;

export const StatePanel = styled.div`
  display: grid;
  place-items: center;
  min-height: 240px;
  margin-top: 12px;
  padding: 24px;
  border: 1px solid ${theme.semantic.border};
  border-radius: ${theme.radius.md};
  background: ${theme.semantic.panel};
  color: ${theme.semantic.textSecondary};
  text-align: center;
`;
