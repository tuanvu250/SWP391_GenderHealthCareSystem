import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./layout/header";
import Footer from "./layout/footer";

import Home from "./home/home";
import Login from "./login/login";
import Register from "./register/register";
import OtpCode from "./login/otp";
import ResetPassword from "./login/resetPassword";

import InputMenstrualCycle from "./menstrualcycle/InputMenstrualCycle"; 
import MenstrualOvulation from "./menstrualcycle/MenstrualOvulation"; 

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/home"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/menstrual-cycle"
          element={
            <MainLayout>
              <InputMenstrualCycle />
            </MainLayout>
          }
        />
        <Route
          path="/menstrual-ovulation"
          element={
            <MainLayout>
              <MenstrualOvulation />
            </MainLayout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<OtpCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
};

export default App;
