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
import { MainnetIsLiveBanner, MarketsContainer } from "./markets-styles";
import MainnetIsLive from "../../assets/images/bera-markets-page/mainnetIsLive.webp";
import MainnetIsLiveMobile from "../../assets/images/bera-markets-page/mainnetIsLiveMobile.webp";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const Markets: React.FC = () => {
  const navigate = useNavigate();
  const sdk = useSDK();
  const isMobile = useMediaQuery("(max-width: 519px)");

  const [marketsData, setMarketsData] = useState<TransformedMarketData[]>([]);
  const [totalSupplyChange, setTotalSupplyChange] = useState<
    string | undefined
  >();
  const { chainId } = useMultichainContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        sdk.markets.transformMarketsData().then((activeMarkets) => {
          activeMarkets && setMarketsData(activeMarkets);
        });
        sdk.ovl.totalSupplyDayChange().then((supplyChange) => {
          supplyChange &&
            setTotalSupplyChange(formatPriceWithCurrency(supplyChange, "%", 4));
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
        <MainnetIsLiveBanner
          src={isMobile ? MainnetIsLiveMobile : MainnetIsLive}
          alt="Mainnet is live"
          onClick={() => navigate("/markets/bera-markets")}
        />
        <FirstSection marketsData={marketsData} />
        <Carousel marketsData={marketsData} />
        <MarketsTable marketsData={marketsData} />
      </Flex>
    </MarketsContainer>
  );
};

export default Markets;
