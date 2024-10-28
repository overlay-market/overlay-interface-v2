import styled from "styled-components";
import  theme  from "../../theme";

export const StyledInput = styled.input<{
  error?: boolean;
  fontSize?: string;
  fontWeight?: string;
  align?: string;
  height?: string;
  padding?: string;
  color?: string;
}>`
  color: ${({ error, color }) =>
    error ? theme.color.red1 : color ? color : theme.color.blue1};
  width: 100%;
  position: relative;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: transparent;
  font-size: ${({ fontSize }) => fontSize ?? "16px"};
  font-weight: ${({ fontWeight }) => fontWeight ?? "700"};
  font-family: Inter;
  text-align: ${({ align }) => (align ? align : "left")};
  height: ${({ height }) => (height ? height : "auto")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: ${({ padding }) => padding ?? "0px"};
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  [type="number"] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    opacity: 0.8;
  }
`;