import { Flex } from "@radix-ui/themes";
import theme from "../../../theme";
import styled from "styled-components";

export const ContentContainer = styled(Flex)`
  flex-direction: column;
  width: 100%;
  gap: 16px;
  padding: 0;

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: 0 10px 10px;
  } 
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 16px;
  outline: none;
  border: none;
  border-radius: 8px;
  box-sizing: border-box;
  color: ${theme.color.grey2};
  background-color: ${theme.color.grey4};
  font-size: 14px;
  font-weight: 600;
  font-family: Inter;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &::placeholder {
    color: #6c7180;
  }
`;
