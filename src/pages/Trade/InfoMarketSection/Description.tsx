import { Flex, Text } from "@radix-ui/themes";
import React, { useEffect, useRef, useState } from "react";
import {
  DescriptionContainer,
  MarketImg,
  TruncatedText,
} from "./description-styles";
import { useCurrentMarketState } from "../../../state/currentMarket/hooks";
import theme from "../../../theme";
import { MARKETS_FULL_LOGOS } from "../../../constants/markets";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

const Description: React.FC = () => {
  const { currentMarket } = useCurrentMarketState();

  const [isTruncated, setIsTruncated] = useState(true);
  const [showToggle, setShowToggle] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const description = currentMarket?.descriptionText ?? "";
  const abstracts = description.split("\\n");
  const firstAbstract = abstracts[0];
  const restOfAbstracts = abstracts.slice(1);

  useEffect(() => {
    setShowToggle(false);
    setIsTruncated(true);
  }, [currentMarket?.id]);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        setShowToggle(
          textRef.current.scrollHeight > textRef.current.offsetHeight ||
            !isTruncated
        );
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, [restOfAbstracts, isTruncated]);

  const toggleTruncate = () => {
    setIsTruncated((prev) => !prev);
  };

  const hasCurrentMarketFullLogo = Boolean(
    currentMarket?.marketId && MARKETS_FULL_LOGOS[currentMarket.marketId]
  );

  return (
    <DescriptionContainer>
      <Flex
        direction={{
          initial: "row",
          sm: hasCurrentMarketFullLogo ? "column" : "row",
        }}
        gap={{
          initial: "16px",
          sm: hasCurrentMarketFullLogo ? "32px" : "16px",
        }}
        align={{
          initial: "center",
          sm: hasCurrentMarketFullLogo ? "start" : "center",
        }}
        pl={!hasCurrentMarketFullLogo && !isMobile ? "16px" : "0px"}
        pt={!hasCurrentMarketFullLogo && !isMobile ? "16px" : "0px"}
      >
        {currentMarket && hasCurrentMarketFullLogo ? (
          <MarketImg
            src={MARKETS_FULL_LOGOS[currentMarket.marketId]}
            alt="market logo"
            width={isMobile ? "60px" : "100%"}
          />
        ) : (
          currentMarket?.logo && (
            <MarketImg
              src={currentMarket.marketLogo}
              alt="market logo"
              width={"60px"}
            />
          )
        )}

        <Flex
          pl={{ initial: "0", sm: hasCurrentMarketFullLogo ? "16px" : "0" }}
        >
          <Text weight={"bold"} size={"3"}>
            {currentMarket?.marketName}
          </Text>
        </Flex>
      </Flex>

      <Flex
        direction={"column"}
        px={{ initial: "0", sm: "16px" }}
        py={"32px"}
        gap={"8px"}
      >
        <Text weight={"bold"} style={{ color: theme.color.grey3 }}>
          {firstAbstract}
        </Text>

        <Flex direction={"column"} position={"relative"} gap={"14px"}>
          <TruncatedText ref={textRef} isTruncated={isTruncated}>
            {restOfAbstracts?.map((abstract, index) => (
              <>
                <Text key={index} style={{ color: theme.color.grey3 }}>
                  {abstract}
                </Text>
                <br />
              </>
            ))}
          </TruncatedText>
          {showToggle && (
            <Text
              weight={"medium"}
              onClick={toggleTruncate}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              {isTruncated ? "Read more" : "Read less"}
            </Text>
          )}
        </Flex>
      </Flex>
    </DescriptionContainer>
  );
};

export default Description;
