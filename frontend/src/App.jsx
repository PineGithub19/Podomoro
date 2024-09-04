import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Forest from "./pages/Forest/Forest";
import LogIn from "./pages/LogIn/Login";
import SignUp from "./pages/SignUp/SignUp";
// import CreateTree from "./pages/CreateTree";
// import ShowTree from "./pages/ShowTree";
// import EditTree from "./pages/EditTree";
// import DeleteTree from "./pages/DeleteTree";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/forest" element={<Forest />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
      {/* <Route path="/trees/create" element={<CreateTree />} />
      <Route path="/trees/details/:id" element={<ShowTree />} />
      <Route path="/trees/edit/:id" element={<EditTree />} />
      <Route path="/trees/delete/:id" element={<DeleteTree />} /> */}
    </Routes>
  );
}

export default App;
