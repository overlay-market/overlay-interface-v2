import styled from "styled-components";

type ColorButtonProps = {
  width?: string;
  bgcolor?: string;
  color?: string;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ColorButton = styled.button<ColorButtonProps>`
  width: ${({ width }) => width ?? "auto"};
  color: ${({ color }) => color ?? "white"};
  background: ${({ bgcolor }) => bgcolor ?? "#53b1f9"};
  opacity: ${({ disabled }) => (disabled ? "0.5" : "1")};
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  height: 42px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 8px;
  border: none;
  transition: opacity 0.2s ease;

  :hover {
    opacity: ${({ disabled }) => (disabled ? "0.5" : "0.9")};
  }
`;
