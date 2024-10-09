import { DropdownMenu } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const DropdownContent = styled(DropdownMenu.Content)`
  background-color: ${theme.color.grey4};
  border-radius: 8px;
  padding: 10px 0px;
  width: 240px;
  max-width: 240px;
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
`;

export const DropdownItem = styled(DropdownMenu.Item)`
  padding: 20px 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background-color: ${theme.color.background};
    border-radius: 0px;
  }
`;

export const DropdownTitle = styled(DropdownMenu.Item)`
  padding: 20px 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  &:hover {
    background-color: transparent;
    border-radius: 0px;
  }
`;

export const ChainLogo = styled.div<{ src: string }>`
  background: no-repeat center/contain url(${({ src }) => src});
  height: 20px;
  width: 20px;
`;

export const HeaderMenuButton = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  gap: 8px;
  background: ${theme.color.grey4};
  position: relative;
  outline: none;
  border: 0;
  cursor: pointer;
`;
