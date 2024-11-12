import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Trade from "./pages/Trade";
import { Container, Flex } from "@radix-ui/themes";
import NavBar from "./components/NavBar";
import Markets from "./pages/Markets";
import theme from "./theme";
import useSDK from "./hooks/useSDK";
import MultichainContextProvider from "./providers/MultichainContextProvider";
import useMultichainContext from "./providers/MultichainContextProvider/useMultichainContext";
import Wallet from "./components/Wallet";
import { useRef } from "react";
import useSyncChainQuery from "./hooks/useSyncChainQuery";
import Popups from "./components/Popups";
import { DEFAULT_MARKET_ID } from "./constants/applications";

const App = () => {
  const chainIdRef = useRef<number | undefined>(undefined);
  useSyncChainQuery(chainIdRef);

  useSDK();
  const { chainId: contextChainID } = useMultichainContext();

  return (
    <MultichainContextProvider initialChainId={contextChainID as number}>
      <Container
        maxWidth={"1280px"}
        minHeight={"100vh"}
        width={"100vw"}
        style={{
          backgroundColor: `${theme.color.background}`,
        }}
      >
        <Popups />
        <Flex direction={{ initial: "column", sm: "row" }}>
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
          </Routes>
        </Flex>
      </Container>
    </MultichainContextProvider>
  );
};

export default App;
