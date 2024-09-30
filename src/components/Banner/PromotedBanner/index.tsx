import {
  StyledPromotedBanner,
  StyledFlex,
  SubtitleText,
  TitleText,
  CardsValue,
} from "../Banners_";
import theme from "../../../theme";

interface PromotedBannerProps {
  Title: string;
  Name: string;
  Value: string;
}

export const PromotedBanner = ({ Title, Name, Value }: PromotedBannerProps) => {
  return (
    <StyledPromotedBanner>
      <StyledFlex>
        <SubtitleText>{Title}</SubtitleText>
        <TitleText style={{ color: theme.color.grey1 }}>{Name}</TitleText>
        <CardsValue>${Value}</CardsValue>
      </StyledFlex>
    </StyledPromotedBanner>
  );
};
