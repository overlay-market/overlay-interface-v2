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

const Description: React.FC = () => {
  const { currentMarket } = useCurrentMarketState();

  const [isTruncated, setIsTruncated] = useState(true);
  const [showToggle, setShowToggle] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  const description = currentMarket?.descriptionText ?? "";
  const abstracts = description.split("\\n");
  const firstAbstract = abstracts[0];
  const restOfAbstracts = abstracts.slice(1);

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

  return (
    <DescriptionContainer>
      {currentMarket?.marketId &&
        MARKETS_FULL_LOGOS[currentMarket.marketId] && (
          <MarketImg
            src={MARKETS_FULL_LOGOS[currentMarket.marketId]}
            alt={`market logo`}
            width={"100%"}
            height={"auto"}
          />
        )}

      <Flex direction={"column"} px={"16px"} py={"32px"} gap={"8px"}>
        <Text weight={"bold"} size={"3"}>
          {currentMarket?.marketName}
        </Text>
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
              style={{ cursor: "pointer" }}
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
