import { Navigate, Route, Routes } from "react-router-dom";
import Trade from "./pages/Trade";
import { Flex, Theme } from "@radix-ui/themes";
import NavBar from "./components/NavBar";
import Markets from "./pages/Markets";
import MultichainContextProvider from "./providers/MultichainContextProvider";
import useMultichainContext from "./providers/MultichainContextProvider/useMultichainContext";
import Wallet from "./components/Wallet";
import { useRef } from "react";
import useSyncChainQuery from "./hooks/useSyncChainQuery";
import Popups from "./components/Popups";
import { DEFAULT_MARKET_ID } from "./constants/applications";
import Portfolio from "./pages/Portfolio";
import { AppContainer } from "./app-styles";
import SDKProvider from "./providers/SDKProvider";
import ScrollToTop from "./utils/scrollToTop";
import Trackers from "./components/Trackers";
// import Leaderboard from "./pages/Leaderboard";
import useScrollbarWidth from "./hooks/useScrollbarWidth";
import BeraMarkets from "./pages/BeraMarkets";

const App = () => {
  const chainIdRef = useRef<number | undefined>(undefined);
  useSyncChainQuery(chainIdRef);

  const { chainId: contextChainID } = useMultichainContext();

  useScrollbarWidth();

  return (
    <MultichainContextProvider initialChainId={contextChainID as number}>
      <SDKProvider>
        <Theme>
          <AppContainer>
            <Trackers.WalletConnectionTracker />
            <ScrollToTop />
            <Popups />
            <Flex direction={{ initial: "column", sm: "row" }} width={"100%"}>
              <NavBar />
              <Wallet />
              <Routes>
                <Route path="/" element={<Navigate to="/markets" />} />
                <Route path="/markets" element={<Markets />} />
                <Route path="/markets/bera-markets" element={<BeraMarkets />} />
                <Route
                  path="/trade"
                  element={<Navigate to={`/trade/${DEFAULT_MARKET_ID}`} />}
                />
                <Route path="/trade/:marketId" element={<Trade />} />
                <Route path="/portfolio" element={<Portfolio />} />
                {/* <Route path="/leaderboard" element={<Leaderboard />} /> */}
              </Routes>
            </Flex>
          </AppContainer>
        </Theme>
      </SDKProvider>
    </MultichainContextProvider>
  );
};

export default App;
