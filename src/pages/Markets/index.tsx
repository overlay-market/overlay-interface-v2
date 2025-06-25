import { Flex } from "@radix-ui/themes";
import MarketsHeader from "./MarketsHeader";
import { FirstSection } from "./MarketsFirstSection";
import Carousel from "./MarketsCarousel";
import MarketsTable from "./MarketsTable";
import { TransformedMarketData } from "overlay-sdk";
import { useEffect, useState } from "react";
import useSDK from "../../providers/SDKProvider/useSDK";
import useMultichainContext from "../../providers/MultichainContextProvider/useMultichainContext";
import { formatPriceWithCurrency } from "../../utils/formatPriceWithCurrency";
import { MarketsContainer } from "./markets-styles";

const Markets: React.FC = () => {
  const [marketsData, setMarketsData] = useState<TransformedMarketData[]>([]);
  const [totalSupplyChange, setTotalSupplyChange] = useState<
    string | undefined
  >();
  const sdk = useSDK();
  const { chainId } = useMultichainContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        sdk.markets.transformMarketsData().then((activeMarkets) => {
          activeMarkets && setMarketsData(activeMarkets);
        });
        sdk.ovl.totalSupplyDayChange().then((supplyChange) => {
          supplyChange &&
            setTotalSupplyChange(formatPriceWithCurrency(supplyChange, "%"));
        });
      } catch (error) {
        console.error("Error fetching markets:", error);
      }
    };

    fetchData();

    // const intervalId = setInterval(fetchData, 60000); // 5 minutes

    // return () => clearInterval(intervalId);
  }, [chainId]);

  return (
    <MarketsContainer direction="column">
      <MarketsHeader ovlSupplyChange={totalSupplyChange} />

      <Flex direction="column">
        <div
          onClick={() => (window.location.href = "/faucet")}
          style={{
            display: window.innerWidth <= 768 ? "none" : "block",
            cursor: "pointer",
          }}
        >
          <img
            src="/images/torch-trading-campaign.webp"
            style={{ width: "100%" }}
            alt="Trading Campaign Banner"
          />
        </div>
        <FirstSection marketsData={marketsData} />
        <Carousel marketsData={marketsData} />
        <MarketsTable marketsData={marketsData} />
      </Flex>
    </MarketsContainer>
  );
};

export default Markets;
