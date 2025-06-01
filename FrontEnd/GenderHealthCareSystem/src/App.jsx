import React from "react";
import { AuthProvider } from "./components/provider/AuthProvider";
import RouteMap from "./routes/Routes";


const App = () => {
  return (
    <AuthProvider>
      <RouteMap />
    </AuthProvider>
  );
};

export default App;
