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
import ScrollToTop from './utils/scrollToTop'
import Referrals from './pages/Referrals';

const App = () => {
  const chainIdRef = useRef<number | undefined>(undefined);
  useSyncChainQuery(chainIdRef);

  const { chainId: contextChainID } = useMultichainContext();

  return (
    <MultichainContextProvider initialChainId={contextChainID as number}>
      <SDKProvider>
        <Theme>
          <AppContainer>
            <ScrollToTop />
            <Popups />
            <Flex direction={{ initial: "column", sm: "row" }} width={"100%"}>
              <NavBar />
              <Wallet />
              <Routes>
                <Route path="/" element={<Navigate to="/markets" />} />
                <Route path="/markets" element={<Markets />} />
                <Route
                  path="/trade"
                  element={<Navigate to={`/trade/${DEFAULT_MARKET_ID}`} />}
                />
                <Route path="/trade/:marketId" element={<Trade />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/referrals" element={<Referrals />} />
              </Routes>
            </Flex>
          </AppContainer>
        </Theme>
      </SDKProvider>
    </MultichainContextProvider>
  );
};

export default App;
