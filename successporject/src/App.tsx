import "./App.scss";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import GeniusKids from "./pages/GeniusKids";
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/geniuses" element={<GeniusKids />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/forgotpassword" element={<ForgotPassword/>}/>
      </Routes>
      <div className="content"></div>
      <footer style={{ backgroundColor: "#323443", height: "5vh" }}></footer>
    </>
  );
}

export default App;
