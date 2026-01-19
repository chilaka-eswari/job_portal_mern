import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Homepage from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobListing from "./pages/jobListing";
import JobDetails from "./pages/JobDetails";
import ApplyForm from "./pages/ApplyForm"; 
import "./App.css";


function App() {
  return (
    <Routes>
      {/* Pages WITH Navbar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/jobs" element={<JobListing />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/apply" element={<ApplyForm />} />

      </Route>

      {/* Pages WITHOUT Navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
