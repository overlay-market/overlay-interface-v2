import {
  StyledPromotedBanner,
  SubtitleText,
  TitleText,
  CardsValue,
} from "../banners-styles";
import { Flex } from "@radix-ui/themes";
import useRedirectToTradePage from "../../../hooks/useRedirectToTradePage";

// Video configuration
// const VIDEO_ID = "dQw4w9WgXcQ"; // Example YouTube video ID

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

  // const handleVideoError = (event: React.SyntheticEvent<HTMLVideoElement>) => {
  //   console.error("Video failed to load", event);
  // };

  return (
    <StyledPromotedBanner
      style={{
        position: "relative",
        cursor: "pointer",
        overflow: "hidden",
      }}
      onClick={() => redirectToTradePage(Id)}
    >
      {/* <video
        autoPlay
        loop
        muted
        playsInline
        onError={handleVideoError}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1,
        }}
        src={`https://www.youtube.com/watch?v=${VIDEO_ID}`}
      /> */}
      <Flex
        direction={"column"}
        justify={"start"}
        align={"start"}
        width={"100%"}
        style={{ position: "relative", zIndex: 2 }}
      >
        <SubtitleText>{Title}</SubtitleText>
        <TitleText>{Name}</TitleText>
        <CardsValue>{Value}</CardsValue>
      </Flex>
    </StyledPromotedBanner>
  );
};
