import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Forest from "./pages/Forest";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Store from "./pages/Store";
import Tag from "./pages/Tag";
import ProtectRoute from "./components/ProtectRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/home" element={<ProtectRoute element={<Home />} />} />
      <Route path="/forest" element={<ProtectRoute element={<Forest />} />} />
      <Route path="/store" element={<ProtectRoute element={<Store />} />} />
      <Route path="/tag" element={<ProtectRoute element={<Tag />} />} />
    </Routes>
  );
}

export default App;
