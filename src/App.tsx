import { Navigate, Route, Routes } from "react-router-dom";
import Trade from "./pages/Trade";
import { Flex, Theme } from "@radix-ui/themes";
import NavBar from "./components/NavBar";
import Markets from "./pages/Markets";
import MultichainContextProvider from "./providers/MultichainContextProvider";
import Wallet from "./components/Wallet";
import { lazy, Suspense, useRef, useMemo } from "react";
import useSyncChainQuery from "./hooks/useSyncChainQuery";
import Popups from "./components/Popups";
import Portfolio from "./pages/Portfolio";
import { AppContainer } from "./app-styles";
import SDKProvider from "./providers/SDKProvider";
import ScrollToTop from "./utils/scrollToTop";
import Referrals from "./pages/Referrals";
import Leaderboard from "./pages/Leaderboard";
import { LiFiProvider } from "./providers/LiFiProvider";
import Airdrops from "./pages/Airdrops";
import FundedTrader from "./pages/FundedTrader";
import ExchangeLiFi from "./pages/ExchangeLiFi";
import AnalyticsListener from "./analytics/AnalyticsListener";
import WalletTracker from "./analytics/WalletTracker";
import ZodiacManager from "./components/Wallet/ZodiacManager";
import { ZodiacProvider } from "./providers/ZodiacProvider";
import useAccount from "./hooks/useAccount";
import TerminationGuard from "./components/TerminationGuard";

// Dev-only: lazy-loaded share card preview page (excluded from production builds)
const DevShareCard = import.meta.env.DEV
  ? lazy(() => import("./pages/DevShareCard"))
  : null;

const AppContent = () => {
  const chainIdRef = useRef<number | undefined>(undefined);
  useSyncChainQuery(chainIdRef);
  const { isAvatarTradingActive } = useAccount();

  const exchangeElement = useMemo(
    () => isAvatarTradingActive ? <Navigate to="/markets" /> : <ExchangeLiFi />,
    [isAvatarTradingActive]
  );

  return (
    <Theme>
      <AppContainer>
        <AnalyticsListener />
        <WalletTracker />
        <ZodiacManager />
        <ScrollToTop />
        <Popups />
        <TerminationGuard />
        <Flex direction={{ initial: "column", sm: "row" }} width={"100%"}>
          <NavBar />
          <Wallet />
          <Routes>
            <Route path="/" element={<Navigate to="/markets" />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/trade/*" element={<Trade />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/referrals" element={<Referrals />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route
              path="/leaderboard/:seasonId"
              element={<Leaderboard />}
            />
            <Route path="/airdrops" element={<Airdrops />} />
            <Route path="/funded-trader" element={<FundedTrader />} />
            <Route path="/exchange/*" element={exchangeElement} />
            {DevShareCard && (
              <Route path="/dev/share-card" element={<Suspense fallback={null}><DevShareCard /></Suspense>} />
            )}
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
