import { ChevronDownIcon, DropdownMenu, Text } from "@radix-ui/themes";
import { useState } from "react";
import {
  ColumnSelectButton,
  StyledDropdownContent,
  StyledDropdownItem,
} from "./column-selector-styles";
import { ColumnDef, ColumnKey } from "../types";

interface ColumnSelectorProps {
  selectedLabel: string;
  setSelectedColumn: (key: ColumnKey) => void;
  columns: ColumnDef[];
}

const ColumnSelector = ({
  selectedLabel,
  setSelectedColumn,
  columns,
}: ColumnSelectorProps) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger>
        <ColumnSelectButton>
          {selectedLabel}
          <ChevronDownIcon
            style={{ transform: open ? "rotate(180deg)" : undefined }}
          />
        </ColumnSelectButton>
      </DropdownMenu.Trigger>
      <StyledDropdownContent align="end">
        {columns.map((option) => (
          <StyledDropdownItem
            key={option.value}
            onClick={() => setSelectedColumn(option.value)}
          >
            <Text>{option.label}</Text>
          </StyledDropdownItem>
        ))}
      </StyledDropdownContent>
    </DropdownMenu.Root>
  );
};

export default ColumnSelector;
