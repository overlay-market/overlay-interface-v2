import {
  StyledPromotedBanner,
  SubtitleText,
  TitleText,
  CardsValue,
} from "../banners-styles";
import theme from "../../../theme";
import { Flex } from "@radix-ui/themes";
import { MARKETS_FULL_LOGOS } from "../../../constants/markets";

interface PromotedBannerProps {
  Title: string;
  Name: string;
  Value: string | number | undefined;
  Id: string;
}

export const PromotedBanner = ({
  Title,
  Name,
  Value,
  Id,
}: PromotedBannerProps) => {
  return (
    <StyledPromotedBanner
      style={{ backgroundImage: `url(${MARKETS_FULL_LOGOS[Id]})` }}
    >
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
