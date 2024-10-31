import styled from "styled-components";
import theme from "../../theme";
import { Button, Flex } from "@radix-ui/themes";
import { ChevronDown } from "react-feather";

export const Table = styled.table<{ width?: string, minWidth?: string }>`
  width: ${(props) => (props.width ?? '100%')};
  min-width: ${(props) => (props.minWidth ?? '100%')};
  border-collapse: collapse;
  margin: 24px 0px;
`;

export const StyledHeader = styled.th`
  padding-bottom: 16px;
  text-align: left;
  font-weight: 400;
  color: ${theme.color.grey3};
  border-bottom: 1px solid ${theme.color.grey6};
`;

export const StyledRow = styled.tr`
  border-bottom: 1px solid ${theme.color.grey6};

  &:hover {
    background-color: ${theme.color.grey7};
    cursor: pointer;
   }
`;

export const StyledCell = styled.td`
  padding: 16px 0px;
  text-align: left;
`;

export const PaginationButton = styled(Button)<{ active?: boolean, navBtn: boolean }>`
  background-color: ${({ navBtn }) => (navBtn ? theme.color.grey4 : theme.color.background)};
  border: ${({ active }) => (active ? `1px solid ${theme.color.grey3}` : '')};
  border-radius: 4px;
  color: ${theme.color.grey2};
  width: 28px;
  padding: 4px 8px;
  margin: 0 4px;
  cursor: pointer;

  &:hover {
   box-shadow: 0 0 5px ${theme.color.grey3};
  }

  &[disabled] {
    color: ${theme.color.grey5};
    cursor: not-allowed;
    &:hover {
      box-shadow: none;
     }
  }
`;

export const PaginationFlex = styled(Flex)`
  margin-top: 16px;
  align-items: center;
`;

export const Dropdown = styled.div`
  position: relative;
  padding: 6.5px 10px;
  background: ${theme.color.grey4};
  border-radius: 4px;
  margin-left: 8px;
  box-sizing: border-box;
  max-width: 104px;
  white-space: nowrap;

  &:hover {
    cursor: pointer;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    .dropdown-menu {
      display: block;
    }

    .chevron {
      transform: rotate(180deg);
    }
  }
`

export const DropdownMenu = styled.div`
  position: absolute;
  z-index: 1;
  top: 100%;
  left: 0;
  background: ${theme.color.grey4};
  border-radius: 0 0 4px 4px;
  display: none;

  > div {
    border-radius: 4px;
    padding: 6.5px 10px;
    box-sizing: border-box;
    width: 104px;
    white-space: nowrap;

    &:hover {
      box-shadow: 0 0 2px ${theme.color.grey3};
    }
  }
`

export const RotatingChevron = styled(ChevronDown)`
  margin-left: 8px;
  transition: transform ease-out 0.25s;
`