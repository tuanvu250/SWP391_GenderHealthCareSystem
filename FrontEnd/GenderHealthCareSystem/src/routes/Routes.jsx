import { Route, Routes, Outlet } from "react-router-dom";
import ScrollToTop from "../components/layout/ScrollToTop";
import ProtectedRoute from "./ProtectedRoute";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Home from "../home/Home";
import Login from "../auth/Login";
import Register from "../auth/Register";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";

import ProfileLayout from "../user/ProfileLayout";
import Profile from "../user/Profile";
import HistoryTesting from "../user/HistoryTesting";


import PillTracker from "../healthtracker/PillTracker";
import MenstrualTracker from "../healthtracker/MenstrualTracker";
import OvulationCalendar from "../healthtracker/OvulationCalendar";
import PillScheduleCalendar from "../healthtracker/PillScheduleCalendar";

import Blog from "../blog/Blog";
import BlogDetail from "../blog/BlogDetail";

import AboutPage from "../site-info/AboutPage";
import ServiceList from "../site-info/ServiceList";
import ContactSection from "../site-info/Contact";
import PrivacySection from "../site-info/Privacy";
import ExpertSection from "../site-info/Expert";

import STITesting from "../services/testing/STITesting";
import STIBooking from "../services/testing/STIBooking";
import ConsultationBooking from "../services/consultant/ConsultationBooking";
import Consultation from "../services/consultant/Consultation";

import DashboardLayout from "../dashboard/components/layout/DashboardLayout";
import ManageMyBlog from "../dashboard/features/blog/ManageMyBlog";
import ManageBookingStis from "../dashboard/features/bookingSTIs/ManageBookingStis";
import BookingResult from "../services/BookingResult";

import MinhTrang from "../site-info/Expert-info/MinhTrang";
import PeriodHistory from "../healthtracker/PeriodHistory";

// Layout có Header/Footer
const Layout = () => (
  <div className="flex flex-col min-h-screen">
    <ScrollToTop />
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function RouteMap() {
  return (
    <Routes>
      {/* Các route có layout Header/Footer */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/pill-tracker" element={<PillTracker />} />
        <Route path="/menstrual-tracker" element={<MenstrualTracker />} />
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <ProfileLayout/>
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="history-testing" element={<HistoryTesting />} />
        </Route>

        <Route path="/sti-testing" element={<STITesting />} />
        <Route
          path="/sti-booking"
          element={
            <ProtectedRoute>
              <STIBooking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services/consultationbooking"
          element={<ConsultationBooking />}
        />
        <Route path="/services/consultation" element={<Consultation />} />

        {/* Trang thông tin */}
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/menstrual-ovulation"
          element={
            <ProtectedRoute>
              <OvulationCalendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pill-schedule"
          element={
            <ProtectedRoute>
              <PillScheduleCalendar />
            </ProtectedRoute>
          }
        />

        <Route path="/period-history" element={<PeriodHistory />} />
        <Route path="/booking-result" element={<BookingResult />} />
        <Route path="/servicelist" element={<ServiceList />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:postId" element={<BlogDetail />} />
        <Route path="/contact" element={<ContactSection />} />
        <Route path="/privacy" element={<PrivacySection />} />
        <Route path="/expert" element={<ExpertSection />} />
        <Route path="/expert/0" element={<MinhTrang />} />
      </Route>

      {/* Các route không có Layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Dashboard cho Consultant */}
      <Route
        path="/consultant/dashboard"
        element={
          <ProtectedRoute allowedRoles="Consultant">
            <DashboardLayout userRole="Consultant" />
          </ProtectedRoute>
        }
      >
        <Route index element={<h1>Dashboard</h1>} />
        <Route path="manage-blog" element={<ManageMyBlog />} />
      </Route>

      {/* Dashboard cho Staff */}
      <Route
        path="/staff/dashboard"
        element={
          <ProtectedRoute allowedRoles="Staff">
            <DashboardLayout userRole="Staff" />
          </ProtectedRoute>
        }
      >
        <Route index element={<h1>Dashboard</h1>} />
        <Route path="manage-booking-stis" element={<ManageBookingStis />} />
      </Route>
    </Routes>
  );
}

export default RouteMap;
