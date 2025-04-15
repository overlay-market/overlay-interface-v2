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
// import Leaderboard from "./pages/Leaderboard";
import PowerCards from "./pages/PowerCards";
import useScrollbarWidth from "./hooks/useScrollbarWidth";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.goldsky.com/api/public/project_cm3n5avsu08tw01vthbry8fl7/subgraphs/overlay-power-cards/latest/gn",
  cache: new InMemoryCache(),
});

const App = () => {
  const chainIdRef = useRef<number | undefined>(undefined);
  useSyncChainQuery(chainIdRef);

  const { chainId: contextChainID } = useMultichainContext();

  useScrollbarWidth();

  return (
    <ApolloProvider client={client}>
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
                  <Route path="/power-cards" element={<PowerCards />} />
                  {/* <Route path="/leaderboard" element={<Leaderboard />} /> */}
                </Routes>
              </Flex>
            </AppContainer>
          </Theme>
        </SDKProvider>
      </MultichainContextProvider>
    </ApolloProvider>
  );
};

export default App;
