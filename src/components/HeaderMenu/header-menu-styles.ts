import { DropdownMenu } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const DropdownContent = styled(DropdownMenu.Content)`
  background-color: ${theme.semantic.panel};
  border: 1px solid ${theme.semantic.border};
  border-radius: ${theme.radius.md};
  padding: 10px 0px;
  width: 240px;
  max-width: 240px;
  box-shadow: ${theme.shadow.popover};
`;

export const DropdownItem = styled(DropdownMenu.Item)`
  padding: 20px 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background-color: ${theme.semantic.hover};
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
  border-radius: ${theme.radius.md};
  gap: 8px;
  background: ${theme.semantic.field};
  border: 1px solid ${theme.semantic.border};
  position: relative;
  outline: none;
  cursor: pointer;
`;

export const Separator = styled.div`
  display: flex;
  justify-content: center;
  height: 1px;
  width: 86%;
  background: ${theme.semantic.border};
  margin: 16px auto;
  
  @media (min-width: 1024px) {
    display: none;
  }
`
