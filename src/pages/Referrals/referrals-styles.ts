import { Flex } from "@radix-ui/themes"
import styled from "styled-components"
import theme from "../../theme"

export const LineSeparator = styled(Flex)`
  @media (min-width: ${theme.breakpoints.sm}) {
    height: 0;
    width: calc(100% - ${theme.headerSize.tabletWidth});
    position: absolute;
    top: ${theme.headerSize.height};
    left: ${theme.headerSize.tabletWidth};
    border-bottom: 1px solid ${theme.color.darkBlue};
  }

  @media (min-width: ${theme.breakpoints.md}) {
    width: calc(100% - ${theme.headerSize.width});
    left: ${theme.headerSize.width};
  
  }
`

export const GradientBorderBox = styled(Flex)`
  @media (min-width: ${theme.breakpoints.sm}) {
    border: solid 1px transparent; 
    border-radius: 16px;
    background: linear-gradient(${theme.color.background}, ${theme.color.background}) padding-box,
        linear-gradient(90deg, #ffc955 0%, #ff7cd5 100%) border-box;
  } 
`;


