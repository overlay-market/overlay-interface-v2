import "./App.css";
import { Route, Routes } from "react-router-dom";
import Trade from "./pages/Trade/Trade";
import { Container, Flex } from "@radix-ui/themes";
import NavBar from "./components/NavBar/NavBar";
import WalletChainBox from "./components/WalletChainBox/WalletChainBox";

const App = () => {
  return (
    <Container
      maxWidth={"1280px"}
      minHeight={"100vh"}
      width={"100vw"}
      style={{
        backgroundColor: "gray",
      }}
    >
      <Flex direction={{ initial: "column", md: "row" }}>
        <NavBar />
        <WalletChainBox />
        <Routes>
          <Route path="/trade" element={<Trade />} />
        </Routes>
      </Flex>
    </Container>
  );
};

export default App;
