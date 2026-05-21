import styled, { css } from "styled-components";
import theme from "../../theme";

export const PageShell = styled.main`
  display: grid;
  gap: 14px;
  width: 100%;
  min-height: calc(100vh - ${theme.headerSize.mobileHeight});
  padding: 14px 14px calc(96px + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, #070809 0%, ${theme.semantic.bg} 48%);
  color: ${theme.semantic.textPrimary};

  @media (min-width: ${theme.breakpoints.sm}) {
    min-height: calc(100vh - ${theme.headerSize.height});
    padding: 20px 24px 44px;
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    padding: 24px 36px 52px;
  }
`;

export const HeroSection = styled.section`
  display: grid;
  gap: 10px;
  max-width: 960px;
`;

export const Eyebrow = styled.div`
  color: ${theme.semantic.accent};
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  max-width: 800px;
  margin: 0;
  color: ${theme.semantic.textPrimary};
  font-size: 36px;
  font-weight: 900;
  line-height: 0.98;
  letter-spacing: 0;

  @media (min-width: ${theme.breakpoints.sm}) {
    font-size: 48px;
  }
`;

export const Subtitle = styled.p`
  max-width: 720px;
  margin: 0;
  color: ${theme.semantic.textSecondary};
  font-size: 14px;
  font-weight: 600;
  line-height: 1.45;
`;

export const VerificationGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
  align-items: stretch;

  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: minmax(0, 1.08fr) minmax(340px, 0.92fr);
  }
`;

export const ToolPanel = styled.form`
  display: grid;
  gap: 18px;
  min-width: 0;
  padding: 18px;
  border: 1px solid ${theme.semantic.border};
  border-radius: ${theme.radius.md};
  background:
    radial-gradient(circle at top right, rgba(243, 169, 27, 0.11), transparent 34%),
    ${theme.semantic.panel};
  box-shadow: ${theme.shadow.panel};

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 22px;
  }
`;

export const PanelHeader = styled.div`
  display: grid;
  gap: 4px;
`;

export const PanelTitle = styled.h2`
  margin: 0;
  color: ${theme.semantic.textPrimary};
  font-size: 20px;
  font-weight: 900;
  line-height: 1.15;
`;

export const PanelCopy = styled.p`
  max-width: 620px;
  margin: 0;
  color: ${theme.semantic.textMuted};
  font-size: 13px;
  font-weight: 650;
  line-height: 1.45;
`;

export const SearchRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 10px;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: minmax(156px, 0.35fr) minmax(0, 1fr) auto;
  }
`;

const fieldStyles = css`
  width: 100%;
  min-width: 0;
  height: 48px;
  border: 1px solid ${theme.semantic.border};
  border-radius: ${theme.radius.md};
  background: ${theme.semantic.field};
  color: ${theme.semantic.textPrimary};
  font-size: 14px;
  font-weight: 700;

  &:focus {
    border-color: ${theme.semantic.focus};
    outline: none;
    box-shadow: ${theme.shadow.focus};
  }
`;

export const TypeSelect = styled.select`
  ${fieldStyles}
  padding: 0 38px 0 14px;
  cursor: pointer;
`;

export const QueryInput = styled.input`
  ${fieldStyles}
  padding: 0 14px;

  &::placeholder {
    color: ${theme.semantic.textMuted};
  }
`;

export const SearchButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 132px;
  height: 48px;
  border: 0;
  border-radius: ${theme.radius.md};
  background: ${theme.gradient.accent};
  color: #111214;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.14s ease, filter 0.14s ease;

  &:hover:not(:disabled) {
    filter: brightness(1.06);
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    filter: grayscale(0.42);
    opacity: 0.72;
  }
`;

export const NoticeStack = styled.div`
  display: grid;
  gap: 8px;
`;

export const Notice = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px;
  border: 1px solid ${theme.semantic.borderMuted};
  border-radius: ${theme.radius.md};
  background: rgba(24, 26, 31, 0.7);
  color: ${theme.semantic.textSecondary};
  font-size: 12px;
  font-weight: 700;
  line-height: 1.42;
`;

export const ResultPanel = styled.aside<{ $state: "idle" | "verified" | "unverified" }>`
  display: grid;
  align-content: start;
  gap: 16px;
  min-width: 0;
  padding: 18px;
  border: 1px solid
    ${({ $state }) => {
      if ($state === "verified") return theme.semantic.positive;
      if ($state === "unverified") return theme.semantic.negative;
      return theme.semantic.border;
    }};
  border-radius: ${theme.radius.md};
  background:
    ${({ $state }) => {
      if ($state === "verified") {
        return "linear-gradient(180deg, rgba(40, 209, 154, 0.12), rgba(16, 17, 20, 0.96))";
      }
      if ($state === "unverified") {
        return "linear-gradient(180deg, rgba(240, 68, 94, 0.12), rgba(16, 17, 20, 0.96))";
      }
      return theme.semantic.panel;
    }};
  box-shadow: ${theme.shadow.panel};

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 22px;
  }
`;

export const ResultStatus = styled.div<{ $state: "idle" | "verified" | "unverified" }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  background: ${({ $state }) => {
    if ($state === "verified") return theme.semantic.positiveSoft;
    if ($state === "unverified") return theme.semantic.negativeSoft;
    return theme.semantic.field;
  }};
  color: ${({ $state }) => {
    if ($state === "verified") return theme.semantic.positive;
    if ($state === "unverified") return theme.semantic.negative;
    return theme.semantic.textSecondary;
  }};
  font-size: 12px;
  font-weight: 900;
`;

export const ResultTitle = styled.h2`
  margin: 0;
  color: ${theme.semantic.textPrimary};
  font-size: 24px;
  font-weight: 900;
  line-height: 1.1;
`;

export const ResultCopy = styled.p`
  margin: 0;
  color: ${theme.semantic.textSecondary};
  font-size: 13px;
  font-weight: 650;
  line-height: 1.5;
`;

export const DetailList = styled.dl`
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
`;

export const DetailRow = styled.div`
  display: grid;
  gap: 4px;
`;

export const DetailLabel = styled.dt`
  color: ${theme.semantic.textMuted};
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
`;

export const DetailValue = styled.dd`
  min-width: 0;
  margin: 0;
  color: ${theme.semantic.textPrimary};
  font-size: 14px;
  font-weight: 800;
  overflow-wrap: anywhere;
`;

export const ProfileLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  color: ${theme.semantic.accentHover};
  font-size: 13px;
  font-weight: 900;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const SafetySection = styled.section`
  display: grid;
  gap: 6px;
  min-width: 0;
  padding: 16px 18px;
  border: 1px solid ${theme.semantic.borderMuted};
  border-radius: ${theme.radius.md};
  background: ${theme.semantic.bgElevated};

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 18px 20px;
  }
`;

export const SafetyTitle = styled.h2`
  margin: 0;
  color: ${theme.semantic.textPrimary};
  font-size: 18px;
  font-weight: 900;
  line-height: 1.2;
`;

export const SafetyCopy = styled.p`
  max-width: 960px;
  margin: 0;
  color: ${theme.semantic.textSecondary};
  font-size: 13px;
  font-weight: 650;
  line-height: 1.45;
`;
