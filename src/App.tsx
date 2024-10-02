import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Trade from "./pages/Trade";
import { Container, Flex } from "@radix-ui/themes";
import NavBar from "./components/NavBar";
import WalletChainBox from "./components/WalletChainBox";
import Markets from "./pages/Markets";
import theme from "./theme";
import useSDK from "./hooks/useSDK";
import MultichainContextProvider from "./providers/MultichainContextProvider";
import useMultichainContext from "./providers/MultichainContextProvider/useMultichainContext";

const App = () => {
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
    </MultichainContextProvider>
  );
};

export default App;
