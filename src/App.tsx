import { Navigate, Route, Routes } from "react-router-dom";
import Trade from "./pages/Trade";
import { Flex } from "@radix-ui/themes";
import NavBar from "./components/NavBar";
import Markets from "./pages/Markets";
import useSDK from "./hooks/useSDK";
import MultichainContextProvider from "./providers/MultichainContextProvider";
import useMultichainContext from "./providers/MultichainContextProvider/useMultichainContext";
import Wallet from "./components/Wallet";
import { useRef } from "react";
import useSyncChainQuery from "./hooks/useSyncChainQuery";
import Popups from "./components/Popups";
import { DEFAULT_MARKET_ID } from "./constants/applications";
import Portfolio from "./pages/Portfolio";
import { AppContainer } from "./app-styles";

const App = () => {
  const chainIdRef = useRef<number | undefined>(undefined);
  useSyncChainQuery(chainIdRef);

  useSDK();
  const { chainId: contextChainID } = useMultichainContext();

  return (
    <MultichainContextProvider initialChainId={contextChainID as number}>
      <AppContainer>
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
          </Routes>
        </Flex>
      </AppContainer>
    </MultichainContextProvider>
  );
};

export default App;
