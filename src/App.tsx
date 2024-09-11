import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Trade from "./pages/Trade/Trade";
import { Container, Flex } from "@radix-ui/themes";
import NavBar from "./components/NavBar/NavBar";
import WalletChainBox from "./components/WalletChainBox/WalletChainBox";
import Markets from "./pages/Markets/Markets";
import { theme } from "./theme/theme";

const App = () => {
  return (
    <Container
      maxWidth={"1280px"}
      minHeight={"100vh"}
      width={"100vw"}
      style={{
        backgroundColor: `${theme.background}`,
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
  );
};

export default App;
