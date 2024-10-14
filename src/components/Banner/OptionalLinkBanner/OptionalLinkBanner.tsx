import { Flex, Text } from "@radix-ui/themes";
import styled from "styled-components";
import { StyledOptionalLinkBanner } from "./OptionalLinkBanner_";

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

interface OptionalLinkBanner {
  Title: string;
  Name: string;
  Link: string;
}

export const OptionalLinkBanner = ({
  Title,
  Name,
  Link,
}: OptionalLinkBanner) => {
  return (
    <StyledOptionalLinkBanner>
      <StyledFlex>
        <SubtitleText>{Title}</SubtitleText>
        <TitleText>{Name}</TitleText>
        <SubtitleText>{Link}</SubtitleText>
      </StyledFlex>
    </StyledOptionalLinkBanner>
  );
};
