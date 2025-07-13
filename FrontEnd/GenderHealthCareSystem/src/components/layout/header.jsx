import { Avatar, Badge, Button, Dropdown, Drawer, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import {
  CaretDownFilled,
  BellOutlined,
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Children, useState } from "react";
import LogoText from "../../assets/logo-text.svg";
import LogoSign from "../../assets/logo-sign.svg";
import { useAuth } from "../provider/AuthProvider";
import LoginRequiredModal from "../common/LoginRequiredModal";

const { Text, Title } = Typography;
const Header = () => {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const auth = useAuth();
  const user = auth.user;
  const isLoggedIn = auth.isAuthenticated;

  const handleLogout = () => {
    auth.logoutAction();
    navigate("/");
  };

  const handleLoginRequired = (service) => {
    if (!isLoggedIn) {
      setIsLoginModal(true);
    } else {
      switch (service) {
        case "menstrual-tracker":
          navigate("/menstrual/tracker");
          break;
        case "pill-tracker":
          navigate("/pill/tracker");
          break;
      }
      setMenuVisible(false);
    }
  };

  // Định nghĩa lại userMenu dưới dạng object cho Ant Design v5
  const userMenu = {
    items: [
      user && {
        key: "user-info",
        label: (
          <div className="flex items-center space-x-2 gap-2">
            <Avatar
              src={user?.userImageUrl}
              icon={!user?.userImageUrl && <UserOutlined />}
              size="default"
            />
            <span className="font-bold">{user?.fullName}</span>
          </div>
        ),
      },
      {
        key: "profile",
        label: "Thông tin cá nhân",
        onClick: () => navigate("/user/profile"),
      },
      {
        key: "history-testing",
        label: "Lịch sử",
        children: [
          {
            key: "history-testing",
            label: "Lịch sử xét nghiệm",
            onClick: () => navigate("/user/history-testing"),
          },
          {
            key: "history-consultation",
            label: "Lịch sử tư vấn",
            onClick: () => navigate("/user/history-consultation"),
          },
          {
            key: "history-feedback",
            label: "Lịch sử đánh giá",
            onClick: () => navigate("/user/history-feedback"),
          },
        ]
      },
      {
        key: "settings",
        label: "Cài đặt tài khoản",
        onClick: () => navigate("/user/account-settings"),
      },
      {
        key: "logout",
        label: "Đăng xuất",
        onClick: handleLogout,
      },
    ].filter(Boolean), // Lọc bỏ các mục null/undefined
  };

  // Định nghĩa lại servicesMenu dưới dạng object
  const servicesMenu = {
    items: [
      {
        key: "1",
        label: "Xét nghiệm STIs",
        onClick: () => navigate("/sti-testing"),
      },
      {
        key: "2",
        label: "Đặt lịch tư vấn",
        onClick: () => navigate("/services/consultation"),
      },
      {
        key: "3",
        label: "Đặt câu hỏi trực tuyến",
        onClick: () => navigate("/services/asking"),
      },
    ],
  };
  const healthTracker = {
    items: [
      {
        key: "1",
        label: "Theo dõi chu kì kinh nguyệt",
        onClick: () => handleLoginRequired("menstrual-tracker"),
      },
      {
        key: "2",
        label: "Theo dõi lịch uống thuốc tránh thai",
        onClick: () => handleLoginRequired("pill-tracker"),
      },
    ],
  };
  return (
    <header className="bg-white py-2.5 z-50 px-4 md:px-8 text-gray-800 shadow-sm sticky top-0 border-b border-gray-100">
      <div className="mx-auto flex justify-between items-center w-full">
        {/* Logo */}
        <a
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <img src={LogoSign} alt="LogoSign" className="h-10" />
          <img src={LogoText} alt="LogoText" className="h-9" />
        </a>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:block">
          <ul className="flex space-x-8 font-medium">
            <li className="hover:text-[#0099CF] cursor-pointer transition-colors border-b-2 border-transparent hover:border-[#0099CF] py-2">
              <a onClick={() => navigate("/home")}>Trang chủ</a>
            </li>
            <li className="hover:text-[#0099CF] cursor-pointer transition-colors border-b-2 border-transparent hover:border-[#0099CF] py-2">
              <Dropdown menu={servicesMenu} trigger={["hover"]}>
                <a className="flex items-center space-x-1">
                  <span>Dịch vụ</span>
                  <CaretDownFilled className="text-gray-500 size-2.5 ml-1" />
                </a>
              </Dropdown>
            </li>
            <li className="hover:text-[#0099CF] cursor-pointer transition-colors border-b-2 border-transparent hover:border-[#0099CF] py-2">
              <Dropdown menu={healthTracker} trigger={["hover"]}>
                <a className="flex items-center space-x-1">
                  <span>Sức khỏe</span>
                  <CaretDownFilled className="text-gray-500 size-2.5 ml-1" />
                </a>
              </Dropdown>
            </li>
            <li className="hover:text-[#0099CF] cursor-pointer transition-colors border-b-2 border-transparent hover:border-[#0099CF] py-2">
              <a onClick={() => navigate("/about")}>Giới thiệu</a>
            </li>
            <li className="hover:text-[#0099CF] cursor-pointer transition-colors border-b-2 border-transparent hover:border-[#0099CF] py-2">
              <a onClick={() => navigate("/blog")}>Blog</a>
            </li>
            {user && user?.role !== "Customer" && (
              <li className="hover:text-[#0099CF] cursor-pointer transition-colors border-b-2 border-transparent hover:border-[#0099CF] py-2">
                <a onClick={() => navigate(`/${user.role.toLowerCase()}/dashboard`)}>Dashboard</a>
              </li>
            )}
          </ul>
        </nav>

        {/* Search and Login - Desktop and Tablet */}
        <div className="flex items-center gap-3">
          {/* User Profile/Login - All sizes */}
          {isLoggedIn ? (
            <div className="md:flex items-center gap-3 md:gap-6 md:show hidden">
              <div>
                <span className="text-sm text-gray-500 mr-2 hidden md:inline-block">
                  {user?.role === "Customer" ? "Khách hàng" : user?.role}
                </span>
                <p className="text-[14px] font-semibold m-0">
                  {user?.fullName || "Người dùng"}
                </p>
              </div>
              <Dropdown menu={userMenu} trigger={["click"]}>
                <Avatar
                  src={user?.userImageUrl}
                  icon={!user?.image && <UserOutlined />}
                  size="large"
                />
              </Dropdown>
            </div>
          ) : (
            <button
              className="py-1.5 px-4 sm:px-6 md:px-8 bg-[#0099CF] text-white rounded-full hover:bg-[#0088bb] font-medium shadow-sm transition-colors text-sm whitespace-nowrap"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </button>
          )}

          {/* Menu button - Mobile */}
          <button
            className="lg:hidden text-gray-600 hover:text-[#0099CF] p-1 ml-2"
            onClick={() => setMenuVisible(true)}
          >
            <MenuOutlined className="text-xl" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <Drawer
        placement="right"
        onClose={() => setMenuVisible(false)}
        open={menuVisible}
        width={280}
        closeIcon={<CloseOutlined />}
        title={
          <div className="flex items-center">
            <span className="font-bold text-lg">Menu</span>
          </div>
        }
      >
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            {isLoggedIn && user && (
              <div
                className="mb-6 py-4 border-b border-gray-100"
                onClick={() => {
                  navigate("/user/profile");
                  setMenuVisible(false);
                }}
              >
                <div className="flex items-center space-x-3 mb-2 gap-2">
                  <Avatar
                    src={user.userImageUrl}
                    icon={!user.userImageUrl && <UserOutlined />}
                    size="large"
                  />
                  <div>
                    <p className="font-medium">
                      {user?.fullName || "Người dùng"}
                    </p>
                    <p className="text-gray-500 text-sm">Xem hồ sơ</p>
                  </div>
                </div>
              </div>
            )}

            <ul className="space-y-4">
              <li>
                <a
                  className="block py-2 font-medium hover:text-[#0099CF] !text-gray-800"
                  onClick={() => navigate("/home")}
                >
                  Trang chủ
                </a>
              </li>

              <li className="border-b border-gray-100 pb-4">
                <p className="font-medium mb-2">Dịch vụ</p>
                <ul className="pl-4 space-y-3">
                  <li>
                    <a
                      className="block !text-gray-800 hover:text-[#0099CF] "
                      onClick={() => {
                        navigate("/sti-testing");
                        setMenuVisible(false);
                      }}
                    >
                      Xét nghiệm STIs
                    </a>
                  </li>
                  <li>
                    <a
                      className="block !text-gray-800 hover:text-[#0099CF]"
                      onClick={() => navigate("/services/consultation")}
                    >
                      Đặt câu hỏi hoặc tư vấn
                    </a>
                  </li>
                </ul>
              </li>

              <li>
                <a
                  className="block py-2 font-medium hover:text-[#0099CF] !text-gray-800"
                  onClick={() => handleLoginRequired("menstrual-tracker")}
                >
                  Theo dõi kỳ kinh
                </a>
              </li>
              <li>
                <a
                  className="block py-2 font-medium hover:text-[#0099CF] !text-gray-800"
                  onClick={() => handleLoginRequired("pill-tracker")}
                >
                  Theo dõi nhắc nhở uống thuốc tránh thai
                </a>
              </li>
              <li>
                <a
                  className="block py-2 font-medium hover:text-[#0099CF] !text-gray-800"
                  onClick={() => navigate("/about")}
                >
                  Giới thiệu
                </a>
              </li>

              <li>
                <a
                  className="block py-2 font-medium hover:text-[#0099CF] !text-gray-800"
                  onClick={() => navigate("/blog")}
                >
                  Blog
                </a>
              </li>
            </ul>

            {isLoggedIn && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <ul className="space-y-4">
                  <li>
                    <a
                      className="flex items-center text-gray-600 hover:text-[#0099CF]"
                      onClick={() => {
                        navigate("/profile");
                        setMenuVisible(false);
                      }}
                    >
                      <UserOutlined className="mr-2" /> Thông tin cá nhân
                    </a>
                  </li>
                  <li>
                    <a
                      className="flex items-center text-gray-600 hover:text-[#0099CF]"
                      onClick={() => {
                        navigate("/notifications");
                        setMenuVisible(false);
                      }}
                    >
                      <BellOutlined className="mr-2" /> Thông báo
                      {<Badge count={5} className="ml-2" />}
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-6 mt-6 border-t border-gray-100">
            {isLoggedIn ? (
              <button
                className="w-full py-2 text-center bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                onClick={() => {
                  handleLogout();
                  setMenuVisible(false);
                }}
              >
                Đăng xuất
              </button>
            ) : (
              <button
                className="w-full py-2 text-center bg-[#0099CF] text-white rounded-md hover:bg-[#0088bb]"
                onClick={() => {
                  navigate("/login");
                  setMenuVisible(false);
                }}
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </Drawer>

      <LoginRequiredModal
        open={isLoginModal}
        onClose={() => setIsLoginModal(false)}
      />
    </header>
  );
};

export default Header;
