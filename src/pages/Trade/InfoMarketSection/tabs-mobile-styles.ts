import { Tabs } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../../theme";

export const TabsContainer = styled(Tabs.Root)`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: transparent;
`;

export const TabsList = styled(Tabs.List)`
  display: flex;
  border-bottom: 1px solid #1e1e1e;
  gap: 24px;
  padding-bottom: 8px;
`;

export const TabsTrigger = styled(Tabs.Trigger)`
  all: unset;
  cursor: pointer;
  color: ${theme.color.grey3};
   
  &[data-state="active"] {
    color: ${theme.color.grey2};
    transform: scaleX(1);
  }
  
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -8px;
    height: 1px;
    background: linear-gradient(90deg, #FFC955, #FF7CD5); 
    transform: scaleX(0); 
    transform-origin: left;    
  }

  &[data-state="active"]::after {
    transform: scaleX(1);     
  }

  &:hover {
    color: ${theme.color.grey2};
  }
`;
