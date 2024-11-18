import {
  StyledPromotedBanner,
  SubtitleText,
  TitleText,
  CardsValue,
} from "../banners-styles";
import theme from "../../../theme";
import { Flex } from "@radix-ui/themes";

interface PromotedBannerProps {
  Title: string;
  Name: string;
  Value: string | number | undefined;
  Image: string;
}

export const PromotedBanner = ({
  Title,
  Name,
  Value,
  Image,
}: PromotedBannerProps) => {
  return (
    <StyledPromotedBanner style={{ backgroundImage: `url(${Image})` }}>
      <Flex
        direction={"column"}
        justify={"start"}
        align={"start"}
        width={"100%"}
      >
        <SubtitleText>{Title}</SubtitleText>
        <TitleText style={{ color: theme.color.grey1 }}>{Name}</TitleText>
        <CardsValue>${Value}</CardsValue>
      </Flex>
    </StyledPromotedBanner>
  );
};
