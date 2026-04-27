import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "./theme";

export const AppContainer = styled(Flex)`
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  padding: 0;
  min-height: 100vh;
  background: ${theme.semantic.bg};
  color: ${theme.semantic.textPrimary};
`;
