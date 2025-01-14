import styled from "styled-components";
import theme from "../../../theme";
import { Flex } from "@radix-ui/themes";

export const TableHeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 4px;
  color: ${theme.color.grey3};
  font-family: Inter;
  cursor: pointer;

  &:hover {
    color: ${theme.color.blue1};
  }
`;

export const TooltipBox = styled(Flex)`
  justify-content: space-between;
  width: 300px;
  color: ${theme.color.grey2};
  font-size: 12px;
  background-color: #1b2131;
  border: 1px solid rgba(113, 206, 255, 0.5);
  border-radius: 8px;
  padding: 12px;
  font-family: Inter;
  box-sizing: border-box;
`;