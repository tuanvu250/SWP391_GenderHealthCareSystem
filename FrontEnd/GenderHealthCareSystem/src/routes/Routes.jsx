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
import OauthRedirect from "../auth/OauthRedirect";
import GoogleSignupComplete from "../auth/GoogleSignupComplete";

import ProfileLayout from "../user/ProfileLayout";
import Profile from "../user/Profile";
import HistoryTesting from "../user/HistoryTesting";
import HistoryFeedbackTesting from "../user/HistoryFeebackTesting";
import HistoryConsultantBooking from "../user/HistoryConsultantBooking";

import MenstrualLayout from "../healthtracker/MenstrualLayout";
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
import RetailService from "../services/testing/RetailService";
import STIBooking from "../services/testing/STIBooking";
import ConsultationBooking from "../services/consultant/ConsultationBooking";
import Consultation from "../services/consultant/Consultation";
import AskingSection from "../services/asking/AskingSection";
import BookingResult from "../services/BookingResult";
import ConfirmConsultationBooking from "../services/consultant/ConfirmBookingConsultant";
import MyQuestionsPage from "../services/asking/MyQuestionPage";

import DashboardLayout from "../dashboard/components/layout/DashboardLayout";
import Overview from "../dashboard/features/overview/Overview";
import ManageMyBlog from "../dashboard/features/blog/ManageMyBlog";
import ManageBookingStis from "../dashboard/features/booking/ManageBookingSTIs";
import ManageService from "../dashboard/features/service/ManageService";
import ManageUser from "../dashboard/features/user/ManageUser";
import ManageFeedbackService from "../dashboard/features/feedback/ManageFeedbackService";
import ConsultantBookingSchedule from "../dashboard/features/booking/ConsultantBookingSchedule";
import ConsultantProfile from "../dashboard/features/profile/ConsultantProfile";
import ConsultantManagement from "../dashboard/features/profile/ConsultantManagement";
import ConsultantAnswerPage from "../dashboard/features/asking/ConsultantAnswerPage";

import MinhTrang from "../site-info/Expert-info/MinhTrang";


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

        {/* user */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <ProfileLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="history-testing" element={<HistoryTesting />} />
          <Route
            path="history-feedback-testing"
            element={<HistoryFeedbackTesting />}
          />
          <Route
            path="history-consultation"
            element={<HistoryConsultantBooking />}
          />
        </Route>
        {/* Menstrual */}
        <Route
          path="/menstrual"
          element={
            <ProtectedRoute>
              <MenstrualLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MenstrualTracker />} />
          <Route path="tracker" element={<MenstrualTracker />} />
          <Route path="ovulation" element={<OvulationCalendar />} />
        </Route>

        <Route path="/sti-testing" element={<STITesting />} />
        <Route path="/retail-service" element={<RetailService />} />
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
        <Route path="/services/asking" element={<AskingSection />} />
        <Route
          path="confirm-consultant"
          element={<ConfirmConsultationBooking />}
        />
        <Route path="/my-questions" element={<MyQuestionsPage />} />

        {/* Trang thông tin */}
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/pill-schedule"
          element={
            <ProtectedRoute>
              <PillScheduleCalendar />
            </ProtectedRoute>
          }
        />


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
      <Route path="/oauth2/redirect" element={<OauthRedirect />} />
      <Route
        path="/google-signup-complete"
        element={<GoogleSignupComplete />}
      />

      {/* Dashboard cho Consultant */}
      <Route
        path="/consultant/dashboard"
        element={
          <ProtectedRoute allowedRoles="Consultant">
            <DashboardLayout userRole="Consultant" />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="overview" element={<Overview />} />
        <Route path="manage-blog" element={<ManageMyBlog />} />
        <Route
          path="/consultant/dashboard/consultant-schedule"
          element={<ConsultantBookingSchedule />}
        />
        <Route
          path="/consultant/dashboard/consultant-profile"
          element={<ConsultantProfile />}
        />
        <Route
          path="/consultant/dashboard/consultant-answer"
          element={<ConsultantAnswerPage />}
        />
      </Route>

      {/* Dashboard cho Manager */}
      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute allowedRoles="Manager">
            <DashboardLayout userRole="Manager" />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="overview" element={<Overview />} />
        <Route path="manage-blog" element={<ManageMyBlog />} />
        <Route path="manage-booking-stis" element={<ManageBookingStis />} />
        <Route path="manage-service" element={<ManageService />} />
        <Route
          path="manage-feedback-service"
          element={<ManageFeedbackService />}
        />
        <Route
          path="/manager/dashboard/manage-consultant-profile"
          element={<ConsultantManagement />}
        />
        <Route path="manage-users" element={<ManageUser />} />
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
        <Route index element={<Overview />} />
        <Route path="overview" element={<Overview />} />
        <Route path="manage-booking-stis" element={<ManageBookingStis />} />
      </Route>

      {/* Dashboard cho Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles="Admin">
            <DashboardLayout userRole="Admin" />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="overview" element={<Overview />} />
        <Route path="manage-users" element={<ManageUser />} />
      </Route>
    </Routes>
  );
}

export default RouteMap;