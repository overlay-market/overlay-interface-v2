import { Flex } from "@radix-ui/themes";
import styled from "styled-components";

export const LinksWrapper = styled(Flex)`
  visibility: hidden;

  @media (min-width: 1024px) {
    visibility: visible;
  }
`;