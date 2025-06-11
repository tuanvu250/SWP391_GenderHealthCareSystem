import { createContext, useContext, useState, useEffect } from "react";
import { loginAPI, registerAPI, getUserProfile } from "../utils/api";
import { message } from "antd";

const TOKEN_KEY = "access_token";
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

  // Load user & token từ localStorage khi khởi động
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken) {
      setToken(storedToken);

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Lỗi khi parse dữ liệu user:", error);
        }
      }

      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    console.log("isAuthenticated state changed:", isAuthenticated);
  }, [isAuthenticated]);

  const updateUser = (newUser) => {
    const currentUser = user || {};
    const updatedUser = { ...currentUser, ...newUser };
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  const refreshUserProfile = async () => {
    try {
      const response = await getUserProfile();
      if (response.data) {
        localStorage.setItem(USER_KEY, JSON.stringify(response.data));
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
        // ✅ Lưu token và user vào localStorage
        const jwt = response.data.token;
        localStorage.setItem(TOKEN_KEY, jwt);
        setToken(jwt);

        await refreshUserProfile();

        setIsAuthenticated(true);

        return {
          success: true,
          message: "Đăng nhập thành công!",
          token: jwt,
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
      let msg = "Đăng nhập không thành công, vui lòng thử lại!";
      if (error.response?.status === 401) {
        msg = "Tên đăng nhập hoặc mật khẩu không đúng!";
      } else if (error.response?.status === 500) {
        msg = "Lỗi máy chủ, vui lòng thử lại sau!";
      }
      return { success: false, message: msg };
    }
  };

  const logoutAction = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
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
