import { Route, Routes, Outlet } from "react-router-dom";
import ScrollToTop from "../components/utils/ScrollToTop";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Home from "../home/home";
import Login from "../auth/Login";
import Register from "../auth/Register";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";
import InputMenstrualCycle from "../menstrualcycle/InputMenstrualCycle";
import Profile from "../user/UserProfile";
import ProtectedRoute from "./ProtectedRoute";
import AboutPage from "../site-info/AboutPage";
import MenstrualOvulation from "../menstrualcycle/MenstrualOvulation";
import Blog from "../blog/Blog";
import MedicationReminder from "../menstrualcycle/MedicationReminder";
import ServiceList from "../site-info/ServiceList";
import ContactSection from "../site-info/Contact";
// Layout component with Header
const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
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
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/menstrual-ovulation" element={<MenstrualOvulation />} />
        <Route path="/medication-reminder" element={<MedicationReminder />} />
        <Route path="/servicelist" element={<ServiceList />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<ContactSection />} />
      </Route>

      {/* Routes không có Layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default RouteMap;