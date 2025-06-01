import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import {App as AntdApp} from 'antd';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.jsx'
import Home from "./home/home";
import Login from "./auth/login";
import Register from "./auth/register";
import ForgotPassword from "./auth/forgotPassword";
import ResetPassword from "./auth/resetPassword";
import InputMenstrualCycle from "./menstrualcycle/InputMenstrualCycle";
import MenstrualOvulation from "./menstrualcycle/MenstrualOvulation";
import {AuthProvider} from './components/hooks/useAuth';

let router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "menstrual-cycle",
        element: <InputMenstrualCycle />,
      }
    ]
  },
  {
    path: "login",
    element: <Login />, 
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "reset-password",
    element: <ResetPassword />,
  }
]);  

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)
