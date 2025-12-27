import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Homepage from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function App() {
  return (
    <Routes>
      {/* Pages WITH Navbar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/jobs" element={<div>Jobs Page</div>} />
        <Route path="/companies" element={<div>Companies</div>} />
      </Route>

      {/* Pages WITHOUT Navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
