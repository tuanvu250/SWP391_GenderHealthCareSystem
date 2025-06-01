import React from "react";
import { Outlet } from "react-router";

import Header from "./components/layout/header";
import Footer from "./components/layout/footer";


const App = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default App;
