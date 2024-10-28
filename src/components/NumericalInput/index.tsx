import React from "react";
import { StyledInput } from "./numerical-input-styles";

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};

type NumericalInputProps = {
  value: string | number | undefined;
  handleUserInput: (input: string) => void;
  error?: boolean;
  fontSize?: string;
  fontWeight?: string;
  align?: "right" | "left";
  height?: string;
  padding?: string;
  isFocused?: boolean;
  prependSymbol?: string | undefined;
  color?: string;
};

const NumericalInput = React.memo<
  NumericalInputProps &
    Omit<React.HTMLProps<HTMLInputElement>, "ref" | "onChange" | "as">
>(function InnerInput({
  value,
  handleUserInput,
  placeholder,
  prependSymbol,
  height,
  padding,
  color,
  align,
  isFocused = false,
  ...rest
}) {
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === "" || inputRegex.test(escapeRegExp(nextUserInput))) {
      handleUserInput(nextUserInput);
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
      autoFocus={isFocused}
      // text-specific options
      type="text"
      align={align}
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

export default NumericalInput;
