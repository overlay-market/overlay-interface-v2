import { Flex, Grid, Text } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import theme from "../../theme";
import {
  BeraCloud1Img,
  BeraCloud2Img,
  BeraCloud3Img,
  BeraCloud4Img,
  BeraMarketsContainer,
  BeraMarketsContent,
  BeraMarketsWrapper,
  BottomRightBeraBalloonsImg,
  ImageWrapper,
  LineSeparator,
  Title,
  TopLeftBeraBalloonsImg,
} from "./bera-markets-styles";
import { TransformedMarketData } from "overlay-sdk";
import useSDK from "../../providers/SDKProvider/useSDK";
import MarketCards from "../../components/MarketCards";
import { formatPriceWithCurrency } from "../../utils/formatPriceWithCurrency";
import { BERA_MARKETS } from "../../constants/markets";

const BeraMarkets: React.FC = () => {
  const navigate = useNavigate();

  const sdk = useSDK();

  const [beraMarkets, setBeraMarkets] = useState<TransformedMarketData[]>([
    ...Array(4).fill({
      marketId: "",
      price: "",
      priceCurrency: "",
    }),
  ]);

  useEffect(() => {
    if (!sdk || !sdk.markets) return;

    const fetchData = async () => {
      try {
        sdk.markets.transformMarketsData().then((activeMarkets) => {
          if (activeMarkets) {
            const filteredMarkets = activeMarkets.filter((market) =>
              BERA_MARKETS.includes(market.marketId)
            );

            setBeraMarkets(filteredMarkets);
          }
        });
      } catch (error) {
        console.error("Error fetching markets:", error);
      }
    };

    fetchData();
  }, [sdk]);

  const redirectToMarketsPage = () => {
    navigate(`/markets`);
  };

  return (
    <BeraMarketsWrapper>
      <Flex
        justify={"start"}
        align={"center"}
        gap={"8px"}
        width={"100%"}
        height={{ initial: "47px", sm: theme.headerSize.height }}
        px={"16px"}
        py={"12px"}
      >
        <Flex
          align={"center"}
          gap={"4px"}
          px={"4px"}
          py={"7px"}
          style={{ color: theme.color.blue3, cursor: "pointer" }}
          onClick={() => redirectToMarketsPage()}
        >
          <ArrowLeftIcon />
          <Text size={"1"} weight={"medium"}>
            Back
          </Text>
        </Flex>

        <Text weight={"medium"}>Bera Markets</Text>
      </Flex>
      <LineSeparator />

      <BeraMarketsContainer>
        <TopLeftBeraBalloonsImg />
        <BeraCloud1Img />
        <BeraCloud2Img />
        <BeraCloud3Img />
        <BeraCloud4Img />

        <BeraMarketsContent>
          <Title>Berachain Markets</Title>

          <Grid
            columns={{ initial: "2", lg: "4" }}
            width="auto"
            gap={{ initial: "12px", lg: "16px" }}
          >
            {beraMarkets &&
              beraMarkets.map((market, index) => (
                <MarketCards
                  id={market?.marketId}
                  key={index}
                  priceWithCurrency={
                    market.marketId
                      ? formatPriceWithCurrency(
                          market.price ?? 0,
                          market.priceCurrency,
                          Number(market.price) > 10000 &&
                            Number(market.price) < 1000000
                            ? 5
                            : 4
                        )
                      : ""
                  }
                  title={decodeURIComponent(market.marketId)}
                />
              ))}
          </Grid>
        </BeraMarketsContent>

        <ImageWrapper>
          <BottomRightBeraBalloonsImg />
        </ImageWrapper>
      </BeraMarketsContainer>
    </BeraMarketsWrapper>
  );
};

export default BeraMarkets;
