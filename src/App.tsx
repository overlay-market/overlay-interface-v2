import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Trade from "./pages/Trade/Trade";
import { Container, Flex } from "@radix-ui/themes";
import NavBar from "./components/NavBar/NavBar";
import WalletChainBox from "./components/WalletChainBox/WalletChainBox";
import Markets from "./pages/Markets/Markets";
import { theme } from "./theme/theme";
import useSDK from "./hooks/useSDK";
import { useEffect, useState } from "react";

const LEADERBOARD_POINTS_API =
  "https://api.overlay.market/point-system/points/leaderboard/4";

const App = () => {
  const [markets, setMarkets] = useState<any>([]);

  const sdk = useSDK();
  console.log({ sdk });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const activeMarkets = await sdk.markets.getActiveMarkets();
        const leaderboard = await sdk.markets.getLeaderboard();
        // console.log("ETH Dominance", await sdk.markets.getMarketDetails("NodeMonkes"));
        // console.log("activeMarkets", activeMarkets);
        console.log({ leaderboard });
        // activeMarkets && setMarkets(activeMarkets);
      } catch (error) {
        console.error("Error fetching markets:", error);
      }
    };

    fetchData();
  }, []);
  console.log({ markets });

  const [pointsData, setPointsData] = useState(null);

  const getPointsData = async () => {
    try {
      const response = await fetch(LEADERBOARD_POINTS_API);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPointsData(data);
    } catch (err) {}
  };

  useEffect(() => {
    getPointsData();
  }, []);

  console.log({ pointsData });

  return (
    <Container
      maxWidth={"1280px"}
      minHeight={"100vh"}
      width={"100vw"}
      style={{
        backgroundColor: `${theme.color.background}`,
      }}
    >
      <Flex direction={{ initial: "column", md: "row" }}>
        <NavBar />
        <WalletChainBox />
        <Routes>
          <Route path="/" element={<Navigate to="/markets" />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/trade" element={<Trade />} />
        </Routes>
      </Flex>
    </Container>
  );
};

export default App;
