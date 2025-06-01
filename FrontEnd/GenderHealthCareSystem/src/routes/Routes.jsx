import { Route, Routes, Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Home from "../home/Home";
import Login from "../auth/Login";
import Register from "../auth/Register";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";
import InputMenstrualCycle from "../menstrualcycle/InputMenstrualCycle";
import Profile from "../user/UserProfile"; // Thêm import cho Profile
import ProtectedRoute from "./ProtectedRoute";

// Layout component with Header
const Layout = () => {
  return (
    <>
      <Header />
      <main> 
        <Outlet /> {/* Outlet sẽ render component con tương ứng với route hiện tại */}
      </main>
      <Footer />
    </>
  );
};

function RouteMap() {
  return (
    <Routes>
      {/* Routes với Layout (có Header/Footer) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/menstrual-cycle" element={<InputMenstrualCycle />} />
      </Route>

      {/* Routes không có Layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/profile" element={
        <ProtectedRoute>
            <Profile />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default RouteMap;