import { Navigate, Route, Routes } from "react-router-dom";
import Trade from "./pages/Trade";
import { Flex, Theme } from "@radix-ui/themes";
import NavBar from "./components/NavBar";
import Markets from "./pages/Markets";
import MultichainContextProvider from "./providers/MultichainContextProvider";
import Wallet from "./components/Wallet";
import { useRef } from "react";
import useSyncChainQuery from "./hooks/useSyncChainQuery";
import Popups from "./components/Popups";
import Portfolio from "./pages/Portfolio";
import { AppContainer } from "./app-styles";
import SDKProvider from "./providers/SDKProvider";
import ScrollToTop from "./utils/scrollToTop";
import Leaderboard from "./pages/Leaderboard";
import { LiFiProvider } from "./providers/LiFiProvider";
import Airdrops from "./pages/Airdrops";
import ExchangeLiFi from "./pages/ExchangeLiFi";
import AnalyticsListener from "./analytics/AnalyticsListener";
import WalletTracker from "./analytics/WalletTracker";
import ZodiacManager from "./components/Wallet/ZodiacManager";
import { ZodiacProvider } from "./providers/ZodiacProvider";

const AppContent = () => {
  const chainIdRef = useRef<number | undefined>(undefined);
  useSyncChainQuery(chainIdRef);

  return (
    <Theme>
      <AppContainer>
        <AnalyticsListener />
        <WalletTracker />
        <ZodiacManager />
        <ScrollToTop />
        <Popups />
        <Flex direction={{ initial: "column", sm: "row" }} width={"100%"}>
          <NavBar />
          <Wallet />
          <Routes>
            <Route path="/" element={<Navigate to="/markets" />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/trade/*" element={<Trade />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route
              path="/leaderboard/:seasonId"
              element={<Leaderboard />}
            />
            <Route path="/airdrops" element={<Airdrops />} />
            <Route path="/exchange/*" element={<ExchangeLiFi />} />
            {/* <Route path="/faucet" element={<Faucet />} /> */}
            {/* <Route path="/bridge" element={<Bridge />} /> */}
            <Route path="*" element={<Navigate to="/markets" />} />
          </Routes>
        </Flex>
      </AppContainer>
    </Theme>
  );
};

const App = () => {
  return (
    <ZodiacProvider>
      <MultichainContextProvider>
        <SDKProvider>
          <LiFiProvider>
            <AppContent />
          </LiFiProvider>
        </SDKProvider>
      </MultichainContextProvider>
    </ZodiacProvider>
  );
};

export default App;
