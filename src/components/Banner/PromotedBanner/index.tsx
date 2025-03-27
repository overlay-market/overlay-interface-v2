import {
  StyledPromotedBanner,
  SubtitleText,
  TitleText,
  CardsValue,
} from "../banners-styles";
import { Flex } from "@radix-ui/themes";
import { MARKETS_VIDEOS } from "../../../constants/markets";
import useRedirectToTradePage from "../../../hooks/useRedirectToTradePage";
import { getMarketLogo } from "../../../utils/getMarketLogo";

interface PromotedBannerProps {
  Title?: string;
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
  const redirectToTradePage = useRedirectToTradePage();
  const videoSrc = MARKETS_VIDEOS[Id];
  const imageSrc = getMarketLogo(Id);

  return (
    <StyledPromotedBanner
      style={{
        backgroundImage: `${
          !videoSrc ? "url(" + getMarketLogo(Id) + ")" : "none"
        }`,
        position: "relative",
        cursor: "pointer",
        overflow: "hidden",
      }}
      onClick={() => redirectToTradePage(Id)}
    >
      {videoSrc ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0, // Place it behind the content
          }}
          src={videoSrc}
        />
      ) : (
        <img
          src={imageSrc}
          alt=""
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            top: 0,
            left: 0,
            zIndex: -1,
          }}
        />
      )}
      <Flex
        direction={"column"}
        justify={"start"}
        align={"start"}
        width={"100%"}
        style={{ position: "relative", zIndex: 1 }} // Keep content above the video
      >
        <SubtitleText>{Title}</SubtitleText>
        <TitleText>{Name}</TitleText>
        <CardsValue>{Value}</CardsValue>
      </Flex>
    </StyledPromotedBanner>
  );
};
