import React from "react";
import styled from "styled-components";
import { theme } from "../../theme/theme";

const StyledInput = styled.input<{
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
  text-align: ${({ align }) => align && align};
  height: ${({ height }) => (height ? height : "auto")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: ${({ padding }) => padding ?? "0px 8px"};
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

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};

export const NumericalInput = React.memo(function InnerInput({
  value,
  onUserInput,
  placeholder,
  prependSymbol,
  height,
  padding,
  color,
  ...rest
}: {
  value: string | number | undefined;
  onUserInput: (input: string) => void;
  error?: boolean;
  fontSize?: string;
  fontWeight?: string;
  align?: "right" | "left";
  height?: string;
  padding?: string;
  prependSymbol?: string | undefined;
  color?: string;
} & Omit<React.HTMLProps<HTMLInputElement>, "ref" | "onChange" | "as">) {
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === "" || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput);
    }
  };

  return (
    <StyledInput
      {...rest}
      value={prependSymbol && value ? prependSymbol + value : value}
      onChange={(event) => {
        if (prependSymbol) {
          const value = event.target.value;
          // cut off prepended symbol
          const formattedValue = value.toString().includes(prependSymbol)
            ? value.toString().slice(1, value.toString().length + 1)
            : value;

          // replace commas with periods, because uniswap exclusively uses period as the decimal separator
          enforcer(formattedValue.replace(/,/g, "."));
        } else {
          enforcer(event.target.value.replace(/,/g, "."));
        }
      }}
      // universal input options
      inputMode="decimal"
      autoComplete="off"
      autoCorrect="off"
      // text-specific options
      type="text"
      pattern="^[0-9]*[.,]?[0-9]*$"
      placeholder={placeholder || "0.0"}
      minLength={1}
      maxLength={79}
      spellCheck="false"
      height={height}
      padding={padding}
    />
  );
});
