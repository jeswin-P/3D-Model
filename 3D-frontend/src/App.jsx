import DashBoard from "./components/DashBoard";
import Navbar from "./components/Navbar";
import Viewer from "./components/Viewer";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<DashBoard />} />
        <Route path='/View3DModel' element={<Viewer />} />
      </Routes>
    </>
  );
}

export default App;
