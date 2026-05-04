import styled from "styled-components";
import theme from "../../../theme";
import { focusRing, terminalScrollbars } from "../../../styles/shared-styles";

export const DirectoryPanel = styled.section`
  min-width: 0;
  border: 1px solid ${theme.semantic.borderMuted};
  border-radius: ${theme.radius.md};
  background: #08090a;
  overflow: hidden;
`;

export const DirectoryHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  padding: 14px;
  border-bottom: 1px solid ${theme.semantic.borderMuted};
  background: linear-gradient(180deg, rgba(16, 17, 20, 0.84), rgba(8, 9, 10, 0.98));

  @media (min-width: ${theme.breakpoints.sm}) {
    grid-template-columns: minmax(0, 1fr) minmax(260px, 360px);
    align-items: end;
    padding: 16px;
  }
`;

export const DirectoryTitleGroup = styled.div`
  min-width: 0;
`;

export const DirectoryEyebrow = styled.div`
  color: ${theme.semantic.textMuted};
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
`;

export const DirectoryTitle = styled.h2`
  margin: 4px 0 0;
  color: ${theme.semantic.textPrimary};
  font-size: clamp(20px, 2.4vw, 28px);
  font-weight: 900;
  line-height: 1.05;
`;

export const DirectoryMeta = styled.div`
  margin-top: 6px;
  color: ${theme.semantic.textMuted};
  font-size: 12px;
  font-weight: 700;
`;

export const SearchField = styled.label`
  display: grid;
  grid-template-columns: 16px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  height: 38px;
  min-width: 0;
  padding: 0 12px;
  border: 1px solid ${theme.semantic.border};
  border-radius: ${theme.radius.md};
  background: ${theme.semantic.field};
  color: ${theme.semantic.textMuted};
  ${focusRing}

  &:focus-within {
    border-color: ${theme.semantic.focus};
    box-shadow: ${theme.shadow.focus};
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: ${theme.semantic.textPrimary};
  font-size: 13px;
  font-weight: 600;

  &::placeholder {
    color: ${theme.semantic.textMuted};
  }
`;

export const CategoryBarWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid ${theme.semantic.borderMuted};
  background: #090a0c;
`;

export const CategoriesBar = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
  overflow-x: auto;
  padding: 10px 14px;
  ${terminalScrollbars}

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ScrollIndicator = styled.button<{
  $visible: boolean;
  $side: "left" | "right";
}>`
  all: unset;
  position: absolute;
  ${({ $side }) => ($side === "left" ? "left: 0;" : "right: 0;")}
  top: 0;
  bottom: 0;
  width: 40px;
  background: ${({ $side }) =>
    $side === "left"
      ? `linear-gradient(270deg, transparent, #090a0c 80%)`
      : `linear-gradient(90deg, transparent, #090a0c 80%)`};
  display: ${({ $visible }) => ($visible ? "flex" : "none")};
  align-items: center;
  justify-content: ${({ $side }) =>
    $side === "left" ? "flex-start" : "flex-end"};
  padding-${({ $side }) => ($side === "left" ? "left" : "right")}: 8px;
  color: ${theme.semantic.textMuted};
  z-index: 10;
  cursor: pointer;
  ${focusRing}

  &:hover {
    color: ${theme.semantic.textPrimary};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    display: none !important;
  }
`;

export const CategoryButton = styled.button<{ $active: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 11px;
  border: 1px solid
    ${({ $active }) =>
      $active ? theme.semantic.textPrimary : theme.semantic.border};
  border-radius: ${theme.radius.sm};
  background: ${({ $active }) =>
    $active ? theme.semantic.textPrimary : "transparent"};
  color: ${({ $active }) =>
    $active ? theme.semantic.bg : theme.semantic.textMuted};
  font-size: 12px;
  font-weight: 900;
  white-space: nowrap;
  cursor: pointer;
  ${focusRing}

  &:hover {
    border-color: ${theme.semantic.textSecondary};
    color: ${({ $active }) =>
      $active ? theme.semantic.bg : theme.semantic.textPrimary};
  }

  &:disabled {
    cursor: wait;
    opacity: 0.7;
  }
`;

export const NewBadge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 14px;
  padding: 0 4px;
  border-radius: 3px;
  background: rgba(243, 169, 27, 0.2);
  color: ${theme.semantic.accent};
  font-size: 8px;
  font-weight: 900;
  text-transform: uppercase;
`;

export const TableScroll = styled.div`
  width: 100%;
  overflow-x: auto;
  ${terminalScrollbars}
`;

export const MarketsTableElement = styled.table`
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
  background: #08090a;

  @media (max-width: ${theme.breakpoints.sm}) {
    min-width: 560px;
  }
`;

export const TableHead = styled.thead`
  background: #0b0c0e;
`;

export const HeaderCell = styled.th<{ $align?: "left" | "right" | "center" }>`
  height: 40px;
  padding: 0 14px;
  border-bottom: 1px solid ${theme.semantic.borderMuted};
  color: ${theme.semantic.textMuted};
  font-size: 11px;
  font-weight: 800;
  text-align: ${({ $align }) => $align ?? "left"};
  white-space: nowrap;
`;

export const HeaderButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  ${focusRing}

  &:hover {
    color: ${theme.semantic.textPrimary};
  }
`;

export const BodyRow = styled.tr<{ $disabled?: boolean }>`
  border-bottom: 1px solid ${theme.semantic.borderMuted};
  opacity: ${({ $disabled }) => ($disabled ? 0.58 : 1)};
  cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};

  &:hover {
    background: ${({ $disabled }) =>
      $disabled ? "transparent" : "rgba(255, 255, 255, 0.025)"};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: -2px;
  }
`;

export const Cell = styled.td<{ $align?: "left" | "right" | "center" }>`
  height: 62px;
  padding: 10px 14px;
  color: ${theme.semantic.textPrimary};
  font-size: 13px;
  font-weight: 700;
  text-align: ${({ $align }) => $align ?? "left"};
  vertical-align: middle;
  white-space: nowrap;
`;

export const MarketIdentity = styled.div`
  display: grid;
  grid-template-columns: minmax(38px, max-content) minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const MarketLogo = styled.img<{ $muted?: boolean }>`
  width: 38px;
  height: 38px;
  border: 1px solid ${theme.semantic.border};
  border-radius: 999px;
  object-fit: cover;
  filter: ${({ $muted }) => ($muted ? "grayscale(1) brightness(0.7)" : "none")};
`;

export const LogoStack = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 66px;
  min-width: 66px;

  ${MarketLogo} {
    margin-left: -10px;
    border: 2px solid #08090a;

    &:first-child {
      margin-left: 0;
    }
  }
`;

export const RotatingLogoWrap = styled.div`
  position: relative;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
`;

export const MarketText = styled.div`
  display: grid;
  gap: 5px;
  min-width: 0;
`;

export const MarketName = styled.div`
  max-width: 320px;
  overflow: hidden;
  color: ${theme.semantic.textPrimary};
  font-size: 14px;
  font-weight: 900;
  line-height: 1.05;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: ${theme.breakpoints.sm}) {
    max-width: 190px;
  }
`;

export const MarketSubline = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  color: ${theme.semantic.textMuted};
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
`;

export const MarketBadge = styled.span<{ $tone?: "positive" | "negative" }>`
  display: inline-flex;
  align-items: center;
  height: 17px;
  padding: 0 5px;
  border-radius: 3px;
  border: 1px solid
    ${({ $tone }) =>
      $tone === "negative"
        ? "rgba(240, 68, 94, 0.18)"
        : "rgba(255, 255, 255, 0.08)"};
  background: ${({ $tone }) =>
    $tone === "negative"
      ? "rgba(240, 68, 94, 0.15)"
      : theme.semantic.field};
  color: ${({ $tone }) =>
    $tone === "negative" ? theme.semantic.negative : theme.semantic.textSecondary};
`;

export const NumericCellValue = styled.span<{ $tone?: "positive" | "negative" | "muted" }>`
  color: ${({ $tone }) => {
    if ($tone === "positive") return theme.semantic.positive;
    if ($tone === "negative") return theme.semantic.negative;
    if ($tone === "muted") return theme.semantic.textMuted;
    return theme.semantic.textPrimary;
  }};
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
  font-variant-numeric: tabular-nums;
  font-weight: 900;
`;

export const OiBalance = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 78px;
  align-items: center;
  gap: 8px;
  min-width: 150px;
`;

export const OiPercentages = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: ${theme.semantic.textMuted};
  font-family: "Roboto Mono", "SFMono-Regular", Consolas, monospace;
  font-size: 10px;
  font-weight: 800;
`;

export const SparklineWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  min-width: 126px;
`;

export const MutedDash = styled.span`
  color: ${theme.semantic.textMuted};
`;

export const EmptyState = styled.div`
  display: grid;
  place-items: center;
  min-height: 160px;
  border-top: 1px solid ${theme.semantic.borderMuted};
  color: ${theme.semantic.textMuted};
  font-size: 13px;
  font-weight: 800;
`;

export const SkeletonBlock = styled.span<{ $width?: string }>`
  display: inline-block;
  width: ${({ $width }) => $width ?? "64px"};
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    ${theme.semantic.field},
    ${theme.semantic.hover},
    ${theme.semantic.field}
  );
  background-size: 200% 100%;
  animation: marketsSkeleton 1.2s ease-in-out infinite;

  @keyframes marketsSkeleton {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;
