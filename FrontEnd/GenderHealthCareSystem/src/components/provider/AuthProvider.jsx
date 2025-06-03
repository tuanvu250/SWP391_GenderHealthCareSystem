import { createContext } from "react";
import { useContext, useState, useEffect } from "react";
import { loginAPI, registerAPI } from "../../util/Api";
import { message } from "antd";

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
    //console.log(">>> isLogin:", isAuthenticated);
  }, []);

  useEffect(() => {
    console.log("isAuthenticated state changed:", isAuthenticated);
  }, [isAuthenticated]);

  const loginAction = async (userData) => {
    try {
      const response = await loginAPI(userData);

      if (response.data && response.data.token) {
        sessionStorage.setItem(TOKEN_KEY, response.data.token);
        sessionStorage.setItem(USER_KEY, JSON.stringify(response.data));

        setUser(response.data);
        setToken(response.data.token);
        setIsAuthenticated(true);
        return { success: true, message: "Đăng nhập thành công!" };
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
    }
  };

  const logoutAction = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
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
        loginAction,
        logoutAction,
        registerAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
