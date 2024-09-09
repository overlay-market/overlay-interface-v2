import "./App.css";
import { Route, Routes } from "react-router-dom";
import Trade from "./pages/Trade";
import { Container, Flex } from "@radix-ui/themes";
import NavBar from "./components/NavBar/NavBar";

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
        <Routes>
          <Route path="/trade" element={<Trade />} />
        </Routes>
      </Flex>
    </Container>
  );
};

export default App;
