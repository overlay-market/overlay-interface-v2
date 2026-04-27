import { createGlobalStyle } from "styled-components";
import theme from "./theme";

const GlobalStyle = createGlobalStyle`
  :root {
    --ovl-bg: ${theme.semantic.bg};
    --ovl-bg-elevated: ${theme.semantic.bgElevated};
    --ovl-panel: ${theme.semantic.panel};
    --ovl-panel-raised: ${theme.semantic.panelRaised};
    --ovl-field: ${theme.semantic.field};
    --ovl-hover: ${theme.semantic.hover};
    --ovl-border: ${theme.semantic.border};
    --ovl-border-muted: ${theme.semantic.borderMuted};
    --ovl-text-primary: ${theme.semantic.textPrimary};
    --ovl-text-secondary: ${theme.semantic.textSecondary};
    --ovl-text-muted: ${theme.semantic.textMuted};
    --ovl-accent: ${theme.semantic.accent};
    --ovl-accent-hover: ${theme.semantic.accentHover};
    --ovl-positive: ${theme.semantic.positive};
    --ovl-negative: ${theme.semantic.negative};
    --ovl-warning: ${theme.semantic.warning};
    --ovl-focus: ${theme.semantic.focus};
  }

  * {
    box-sizing: border-box;
  }

  body {
    background: var(--ovl-bg);
    color: var(--ovl-text-primary);
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  button:focus-visible,
  a:focus-visible,
  input:focus-visible,
  [role="button"]:focus-visible,
  [tabindex]:focus-visible {
    outline: 1px solid var(--ovl-focus);
    outline-offset: 2px;
  }

  ::selection {
    background: rgba(243, 169, 27, 0.28);
    color: var(--ovl-text-primary);
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--ovl-bg);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--ovl-border);
    border-radius: 999px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--ovl-text-muted);
  }
`;

export default GlobalStyle;
