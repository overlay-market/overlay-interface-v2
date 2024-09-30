import { Flex, Text } from "@radix-ui/themes";
import styled from "styled-components";
import { StyledPromotedBanner } from "./PromotedBanner_";

const StyledFlex = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const TitleText = styled(Text)`
  font-size: 20px;
  font-weight: 500;
`;

const SubtitleText = styled(Text)`
  font-size: 16px;
  font-weight: 400;
`;

interface PromotedBanner {
  Title: string;
  Name: string;
  Value: string;
}

export const PromotedBanner = ({ Title, Name, Value }: PromotedBanner) => {
  return (
    <StyledPromotedBanner>
      <StyledFlex>
        <SubtitleText>{Title}</SubtitleText>
        <TitleText>{Name}</TitleText>
        <SubtitleText>{Value}</SubtitleText>
      </StyledFlex>
    </StyledPromotedBanner>
  );
};
