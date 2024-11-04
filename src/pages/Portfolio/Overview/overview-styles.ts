import { Grid } from "@radix-ui/themes";
import styled from "styled-components";

export const InfoCardsGrid = styled(Grid)`
  grid-template-columns: 1fr; 
  gap: 8px;
  
  @media (min-width: 380px) {    
    grid-template-columns: repeat(2, 1fr); 
  }

  @media (min-width: 768px) {    
    grid-template-columns: repeat(4, 1fr); 
  }

  @media (min-width: 1024px) {   
    gap: 24px;
  }
`
export const MainCardsGrid = styled(Grid)`
  gap: 8px;
  display: flex;
  flex-direction: column-reverse;
  
  @media (min-width: 1024px) { 
    display: grid;  
    grid-template-columns: 2.2fr 1fr; 
    gap: 24px;
    min-height: 275px;
  }
`