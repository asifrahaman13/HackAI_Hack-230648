import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Currencies from "./components/Currencies/Currencies";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Contact from "./components/Contact/Contact";
import About from "./components/About/About";
import Footer from "./components/Footer/Footer";
import DeleteService from "./components/DeleteService/DeleteService";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Currencies />} />
          {/* <Route path="/home" element={<Home />} /> */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/delete" element={<DeleteService />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  );
}

export default App;
