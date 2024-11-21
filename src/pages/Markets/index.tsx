import { Flex } from "@radix-ui/themes";
import MarketsHeader from "./MarketsHeader";
import { FirstSection } from "./MarketsFirstSection";
import Carousel from "./MarketsCarousel";
import MarketsTable from "./MarketsTable";
import { TransformedMarketData, formatWeiToParsedNumber } from "overlay-sdk";
import { useEffect, useState } from "react";
import useSDK from "../../providers/SDKProvider/useSDK";
import useMultichainContext from "../../providers/MultichainContextProvider/useMultichainContext";

const Markets: React.FC = () => {
  const [marketsData, setMarketsData] = useState<TransformedMarketData[]>([]);
  const [totalSupply, setTotalSupply] = useState<bigint | undefined>();
  const sdk = useSDK();
  const { chainId } = useMultichainContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activeMarkets = await sdk.markets.transformMarketsData();
        const ovSupply = await sdk.ov.totalSupply();

        ovSupply && setTotalSupply(ovSupply);
        activeMarkets && setMarketsData(activeMarkets);
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
      <MarketsHeader ovSupply={formatWeiToParsedNumber(totalSupply, 18, 2)} />
      <FirstSection marketsData={marketsData} />
      <Carousel marketsData={marketsData} />
      <MarketsTable marketsData={marketsData} />
    </Flex>
  );
};

export default Markets;
