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
import { OverlaySDK } from "overlay-sdk"; 

const Markets: React.FC = () => {
  const [marketsData, setMarketsData] = useState<TransformedMarketData[]>([]);
  const [otherChainMarketsData, setOtherChainMarketsData] = useState<TransformedMarketData[]>([]); // new state
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

        // Fetch from BSC_TESTNET only (chainId 97)
        const sdkForBscTestnet = new OverlaySDK({
          chainId: 97,
          rpcUrls: {
            97: import.meta.env.VITE_BSC_TESTNET_RPC,
            56: import.meta.env.VITE_BSC_MAINNET_RPC,
            31337: import.meta.env.VITE_BARTIO_RPC,
            421614: import.meta.env.VITE_ARBITRUM_SEPOLIA_RPC,
          },
          useShiva: true,
        });
        const bscTestnetMarkets = await sdkForBscTestnet.markets.transformMarketsData();
        setOtherChainMarketsData(bscTestnetMarkets);
        // For demonstration, log the BSC_TESTNET markets
        // console.log("Markets from BSC_TESTNET:", bscTestnetMarkets);
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
      <Carousel marketsData={marketsData} otherChainMarketsData={otherChainMarketsData} />
      <MarketsTable marketsData={marketsData} />
      {/* You can use otherChainMarketsData as needed in your UI */}
    </Flex>
  );
};

export default Markets;
