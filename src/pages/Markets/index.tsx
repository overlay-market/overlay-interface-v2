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
          activeMarkets && setMarketsData(activeMarkets)
        })
        sdk.ovl.totalSupplyDayChange().then((supplyChange) => {
          supplyChange &&
          setTotalSupplyChange(formatPriceWithCurrency(supplyChange, "%", 4));
        })
      } catch (error) {
        console.error("Error fetching markets:", error);
      }
    };

    fetchData();

    // const intervalId = setInterval(fetchData, 60000); // 5 minutes

    // return () => clearInterval(intervalId);
  }, [chainId]);

  return (
    <Flex direction="column" width={"100%"} overflowX={"hidden"}>
      <MarketsHeader ovlSupplyChange={totalSupplyChange} />
      <FirstSection marketsData={marketsData} />
      <Carousel marketsData={marketsData} />
      <MarketsTable marketsData={marketsData} />
    </Flex>
  );
};

export default Markets;
