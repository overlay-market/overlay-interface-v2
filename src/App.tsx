import "./App.css";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./pages/Home";
import { AppWrapper } from "./App_";

function App() {
  return (
    <AppWrapper>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </AppWrapper>
  );
}

export default App;
