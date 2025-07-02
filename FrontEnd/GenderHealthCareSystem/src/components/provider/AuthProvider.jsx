import { createContext } from "react";
import { useContext, useState, useEffect } from "react";
import { message } from "antd";
import { getUserProfile, loginAPI, registerAPI } from "../api/Auth.api";

const TOKEN_KEY = "token";
const USER_KEY = "user";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = sessionStorage.getItem(TOKEN_KEY);
    const storedUser = sessionStorage.getItem(USER_KEY);
    const rememberMe = localStorage.getItem("remember") === "true";
    if (storedToken) {
      setToken(storedToken);

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Lỗi khi parse dữ liệu user:", error);
        }
      }
      // Nếu có token, coi như đã đăng nhập
      setIsAuthenticated(true);
    } else if (rememberMe) {
      console.log("Using token from localStorage: ", localStorage.getItem(TOKEN_KEY));
      setToken(localStorage.getItem("token"));
      sessionStorage.setItem(TOKEN_KEY, localStorage.getItem("token"));
      setIsAuthenticated(true);
      refreshUserProfile();
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, [isAuthenticated]);

  const updateUser = (newUser) => {
    const currentUser = user || {};

    const updatedUser = { ...currentUser, ...newUser };

    setUser(updatedUser);

    sessionStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  const refreshUserProfile = async () => {
    try {
      const response = await getUserProfile();
      if (response.data) {
        sessionStorage.setItem(USER_KEY, JSON.stringify(response.data));
        setUser(response.data);
        return { success: true, data: response.data };
      }
      return { success: false, message: "Không nhận được dữ liệu" };
    } catch (error) {
      console.error("Lỗi khi làm mới thông tin người dùng:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể lấy thông tin người dùng",
      };
    }
  };

  const loginAction = async (userData) => {
    try {
      const response = await loginAPI(userData);

      if (response.data && response.data.token) {
        sessionStorage.setItem(TOKEN_KEY, response.data.token);
        setToken(response.data.token);

        refreshUserProfile();

        setIsAuthenticated(true);
        return {
          success: true,
          message: "Đăng nhập thành công!",
          role: response.data.role,
        };
      } else {
        setIsAuthenticated(false);
        return {
          success: false,
          message: "Đăng nhập không thành công, vui lòng thử lại!",
        };
      }
    } catch (error) {
      setIsAuthenticated(false);
      let message = "Đăng nhập không thành công, vui lòng thử lại!";
      if (error.response.status === 401) {
        message = "Tên đăng nhập hoặc mật khẩu không đúng!";
      } else if (error.response.status === 500) {
        message = "Lỗi máy chủ, vui lòng thử lại sau!";
      }
      return { success: false, message: message };
    } finally {
      const rememberMe = localStorage.getItem("remember") === "true";
      if (rememberMe) {
        localStorage.setItem(TOKEN_KEY, sessionStorage.getItem(TOKEN_KEY));
      }
    }
  };

  const logoutAction = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem("token");
    localStorage.removeItem("remember");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    message.success("Đăng xuất thành công!");
  };

  const registerAction = async (userData) => {
    try {
      const response = await registerAPI(userData);
      if (response.data && response.status === 200) {
        return {
          success: true,
          message: "Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.",
        };
      } else {
        return {
          success: false,
          message: "Đăng ký không thành công, vui lòng thử lại!",
        };
      }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Đăng ký không thành công, vui lòng thử lại!",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        token,
        loading,
        refreshUserProfile,
        updateUser,
        loginAction,
        logoutAction,
        registerAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
