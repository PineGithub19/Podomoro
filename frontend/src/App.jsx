import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Forest from "./pages/Forest";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Store from "./pages/Store";
import Tag from "./pages/Tag";
// import CreateTree from "./pages/CreateTree";
// import ShowTree from "./pages/ShowTree";
// import EditTree from "./pages/EditTree";
// import DeleteTree from "./pages/DeleteTree";

function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/forest" element={<Forest />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/store" element={<Store />} />
      <Route path="/tag" element={<Tag />} />
      {/* <Route path="/trees/create" element={<CreateTree />} />
      <Route path="/trees/details/:id" element={<ShowTree />} />
      <Route path="/trees/edit/:id" element={<EditTree />} />
      <Route path="/trees/delete/:id" element={<DeleteTree />} /> */}
    </Routes>
  );
}

export default App;
