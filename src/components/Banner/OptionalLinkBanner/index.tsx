import React from "react";
import {
  StyledOptionalLinkBanner,
  SubtitleText,
  TitleText,
  LinkText,
  LinkIcon,
} from "../banners-styles";
import theme from "../../../theme";
import { Flex } from "@radix-ui/themes";

interface OptionalLinkBannerProps {
  Title: string;
  Name: string;
  Link: string;
}

export const OptionalLinkBanner: React.FC<OptionalLinkBannerProps> = ({
  Title,
  Name,
  Link,
}) => {
  return (
    <StyledOptionalLinkBanner>
      <Flex
        direction={"column"}
        justify={"start"}
        align={"start"}
        width={"100%"}
      >
        <SubtitleText>{Title}</SubtitleText>
        <TitleText style={{ color: theme.color.darkBlue }}>
          {Name} is Live
        </TitleText>
        <LinkText to={"link"}>
          {Link}
          <LinkIcon />
        </LinkText>
      </Flex>
    </StyledOptionalLinkBanner>
  );
};
