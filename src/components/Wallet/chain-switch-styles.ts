import { DropdownMenu } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const ChainLogo = styled.div<{ src: string }>`
  background: no-repeat center/contain url(${({ src }) => src});
  height: 24px;
  width: 24px;
`;

export const DropdownContent = styled(DropdownMenu.Content)`
  background-color: ${theme.color.grey4};
  border-radius: 8px;
  padding: 10px 0px;
  width: 232px;
  max-width: 232px;
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
`;

export const DropdownItem = styled(DropdownMenu.Item)`
  padding: 20px 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 16px;
  cursor: pointer;
  
  &:hover {
    background-color: ${theme.color.background};
    font-weight: 700;
    border-radius: 0px;
  }
`;
