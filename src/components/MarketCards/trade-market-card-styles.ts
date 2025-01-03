import { Flex, Text } from "@radix-ui/themes";
import styled from "styled-components";
import theme from "../../theme";

export const CustomCard = styled(Flex)`
  display: flex;
  flex-direction: column;
  width: 172px;
  height: 273px;
  border-radius: 8px 8px 16px 16px;
  border: 1px solid ${theme.color.darkBlue};
  background-color: ${theme.color.grey7};
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

  &:hover {
    transform: scale(1.02);
    position: relative;
    left: 2px; 
  }
`;

export const CardImg = styled(Flex)`
  width: 100%;
  height: 97px;
  min-height: 97px;
  background-size: cover;
  background-position: center;
  
`;

export const MarketTitle = styled(Text)`
  color: ${theme.color.white};
  line-height: 16px;
  letter-spacing: -0.04em;  
`;

export const MarketDescription = styled(Text)`
  color: ${theme.color.white1};
  line-height: 16.8px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
