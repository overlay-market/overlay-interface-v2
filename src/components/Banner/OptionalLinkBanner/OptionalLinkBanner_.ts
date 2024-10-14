import { Flex } from "@radix-ui/themes";
import styled from "styled-components";

export const StyledOptionalLinkBanner = styled(Flex)`
  position: relative;
  width: 100%;
  height: 300px;
  background-image: linear-gradient(
    to bottom right,
    #ff7e5f,
    /* Vivid orange */ #feb47b,
    /* Vivid peach */ #86a8e7,
    /* Vivid blue */ #91eae4 /* Vivid cyan */
  );
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 20px;
  color: white;
  border-radius: 20px;
  border-bottom-right-radius: 76px;
`;
