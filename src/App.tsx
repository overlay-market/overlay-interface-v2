import { Navigate, Route, Routes, useLocation } from "react-router-dom";
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
import Earn from "./pages/Earn";
import useScrollbarWidth from "./hooks/useScrollbarWidth";
import Stake from "./pages/Earn/StakePage";
import VaultsProvider from "./providers/VaultsProvider";
import { VolatilityModalProvider } from "./providers/VolatilityModalProvider";
import Leaderboard from "./pages/Leaderboard";
import Faucet from "./pages/Faucet";

const earnRoutes = (
  <>
    <Route path="/earn" element={<Earn />} />
    <Route path="/earn/:vaultId" element={<Stake />} />
  </>
);

const VaultsProviderWrapper = () => (
  <VaultsProvider>
    <VolatilityModalProvider>
      <Routes>{earnRoutes}</Routes>
    </VolatilityModalProvider>
  </VaultsProvider>
);

const App = () => {
  const location = useLocation();
  const chainIdRef = useRef<number | undefined>(undefined);
  useSyncChainQuery(chainIdRef);
  const { chainId: contextChainID } = useMultichainContext();

  useScrollbarWidth();

  const isEarnRoute = location.pathname.startsWith("/earn");

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

                {isEarnRoute ? (
                  <Route element={<VaultsProviderWrapper />}>
                    {earnRoutes}
                  </Route>
                ) : (
                  earnRoutes
                )}

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
