import React from "react";
import { AuthProvider } from "./components/provider/AuthProvider";
import RouteMap from "./routes/Routes";
import { ConfigProvider } from "antd";

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0099CF",
          fontFamily: "Montserrat, sans-serif",
        },
      }}
    >
      <AuthProvider>
        <RouteMap />
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
