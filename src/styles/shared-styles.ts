import styled from 'styled-components';
import { Flex } from '@radix-ui/themes';
import theme from '../theme';

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
`;
