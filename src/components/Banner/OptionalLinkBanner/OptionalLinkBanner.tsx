import React from "react";
import {
  StyledOptionalLinkBanner,
  StyledFlex,
  SubtitleText,
  TitleText,
  LinkText,
  LinkIcon,
} from "../Banners_";
import theme from "../../../theme";

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
      <StyledFlex>
        <SubtitleText>{Title}</SubtitleText>
        <TitleText style={{ color: theme.color.darkBlue }}>
          {Name} is Live
        </TitleText>
        <LinkText to={"link"}>
          {Link}
          <LinkIcon />
        </LinkText>
      </StyledFlex>
    </StyledOptionalLinkBanner>
  );
};
