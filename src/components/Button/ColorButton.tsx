import styled from "styled-components";
import theme from "../../theme";

type ColorButtonProps = {
  width?: string;
  bgcolor?: string;
  color?: string;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ColorButton = styled.button<ColorButtonProps>`
  width: ${({ width }) => width ?? "auto"};
  color: ${({ color }) => color ?? theme.color.black};
  background: ${({ bgcolor }) => bgcolor ?? theme.gradient.accent};
  opacity: ${({ disabled }) => (disabled ? "0.5" : "1")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  height: 42px;
  font-size: 14px;
  font-weight: 700;
  border-radius: ${theme.radius.md};
  border: 1px solid ${({ bgcolor }) => bgcolor ?? theme.semantic.accent};
  transition: opacity 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;

  :hover {
    opacity: ${({ disabled }) => (disabled ? "0.5" : "0.9")};
    box-shadow: ${({ disabled }) => (disabled ? "none" : "0 8px 18px rgba(0, 0, 0, 0.28)")};
    filter: ${({ disabled }) => (disabled ? "none" : "brightness(1.04)")};
  }

  &:focus-visible {
    outline: 1px solid ${theme.semantic.focus};
    outline-offset: 2px;
  }
`;
