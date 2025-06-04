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
import Portfolio from "./pages/Portfolio";
import { AppContainer } from "./app-styles";
import SDKProvider from "./providers/SDKProvider";
import ScrollToTop from "./utils/scrollToTop";
import Trackers from "./components/Trackers";
import Leaderboard from "./pages/Leaderboard";
import Faucet from "./pages/Faucet";
import Bridge from "./pages/Bridge";

const App = () => {
  const chainIdRef = useRef<number | undefined>(undefined);
  useSyncChainQuery(chainIdRef);

  const { chainId: contextChainID } = useMultichainContext();

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
                <Route path="/trade" element={<Trade />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/faucet" element={<Faucet />} />
                <Route path="/bridge" element={<Bridge />} />
                <Route path="*" element={<Navigate to="/markets" />} />
              </Routes>
            </Flex>
          </AppContainer>
        </Theme>
      </SDKProvider>
    </MultichainContextProvider>
  );
};

export default App;
