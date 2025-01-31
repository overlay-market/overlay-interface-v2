import styled from "styled-components";
import { Flex, Text } from "@radix-ui/themes";
import theme from "../../theme";
import { Link } from "react-router-dom";
import { ExternalLinkIcon } from "@radix-ui/react-icons";

const BaseBanner = styled(Flex)`
  position: relative;
  width: 100%;
  min-height: 200px;
  height: auto;
  background-image: linear-gradient(
    to bottom right,
    #ff7e5f,
    #feb47b,
    #86a8e7,
    #91eae4
  );
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 20px;
  color: white;
  border-radius: 20px;

  @media (max-width: 768px) {
    min-height: 150px;
    padding: 15px;
  }

  @media (max-width: 480px) {
    min-height: 150px;
    padding: 10px;
  }
`;

export const StyledOptionalLinkBanner = styled(BaseBanner)`
  border-bottom-right-radius: 76px;

  @media (max-width: 768px) {
    border-bottom-right-radius: 50px;
  }

  @media (max-width: 480px) {
    border-bottom-right-radius: 30px;
  }
`;

export const StyledPromotedBanner = styled(BaseBanner)``;

export const TitleText = styled(Text)`
  font-size: clamp(18px, 4vw, 24px);
  font-weight: 600;
  color: ${theme.color.grey1};
  -webkit-text-stroke: 0.5px rgba(0, 0, 0, 0.5);
`;

export const SubtitleText = styled(Text)`
  font-size: clamp(14px, 3vw, 12px);
  font-weight: 500;
  color: ${theme.color.grey1};
`;

export const CardsValue = styled.h2`
  margin: 0;
  font-size: clamp(0.8rem, 3vw, 18px);
  color: ${theme.color.grey1};
  -webkit-text-stroke: 0.5px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;

export const LinkText = styled(Link)`
  display: flex;
  align-items: center;
  font-size: clamp(14px, 3vw, 18px);
  color: ${theme.color.black2};
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

export const LinkIcon = styled(ExternalLinkIcon)`
  margin: 2 0 0 4;
`;
