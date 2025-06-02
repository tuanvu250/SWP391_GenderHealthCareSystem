import { Avatar, Badge, Button, Dropdown, Drawer } from "antd";
import { useNavigate } from "react-router-dom";
import {
  CaretDownFilled,
  BellOutlined,
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useState} from "react";
import LogoText from "../../assets/logo-text.svg";
import LogoSign from "../../assets/logo-sign.svg";
import { useAuth } from "../provider/AuthProvider";

const Header = () => {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const auth = useAuth();
  const user = auth.user;
  const isLoggedIn = auth.isAuthenticated;

  const handleLogout = () => {
    auth.logoutAction();
    navigate("/");
  };

  // Định nghĩa lại userMenu dưới dạng object cho Ant Design v5
  const userMenu = {
    items: [
      user && {
        key: 'user-info',
        label: (
          <div className="flex items-center space-x-2 gap-2">
            <Avatar
              src={user?.userImageUrl}
              icon={!user?.userImageUrl && <UserOutlined />}
              size="default"
            />
            <span className="font-bold">{user?.username}</span>
          </div>
        ),
      },
      {
        key: 'profile',
        label: 'Thông tin cá nhân',
        onClick: () => navigate("/profile")
      },
      {
        key: 'settings',
        label: 'Cài đặt tài khoản',
        onClick: () => navigate("/settings")
      },
      {
        key: 'logout',
        label: 'Đăng xuất',
        onClick: handleLogout
      }
    ].filter(Boolean) // Lọc bỏ các mục null/undefined
  };

  // Định nghĩa lại servicesMenu dưới dạng object
  const servicesMenu = {
    items: [
      {
        key: '1',
        label: 'Xét nghiệm STIs',
        onClick: () => navigate("/services/health-checkup")
      },
      {
        key: '2',
        label: 'Đặt câu hỏi hoặc tư vấn',
        onClick: () => navigate("/services/consultation")
      },
      {
        key: '3',
        label: 'Đặt lịch khám',
        onClick: () => navigate("/services/appointments")
      }
    ]
  };

  return (
    <header className="bg-white py-2.5 z-50 px-4 sm:px-8 md:px-16 text-gray-800 shadow-sm sticky top-0 border-b border-gray-100">
      <div className="container mx-auto flex justify-between items-center">
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
              <a onClick={() => navigate("/menstrual-cycle")}>
                Theo dõi kỳ kinh
              </a>
            </li>
            <li className="hover:text-[#0099CF] cursor-pointer transition-colors border-b-2 border-transparent hover:border-[#0099CF] py-2">
              <a onClick={() => navigate("/about")}>Giới thiệu</a>
            </li>
            <li className="hover:text-[#0099CF] cursor-pointer transition-colors border-b-2 border-transparent hover:border-[#0099CF] py-2">
              <a onClick={() => navigate("/blog")}>Blog</a>
            </li>
          </ul>
        </nav>

        {/* Search and Login - Desktop and Tablet */}
        <div className="flex items-center gap-3">
          {/* Search Bar - Desktop */}
          <div className="relative hidden md:block">
            <div className="flex items-center bg-gray-50 rounded-full overflow-hidden border border-gray-200 hover:border-gray-300">
              <input
                type="text"
                placeholder="Tìm kiếm nhanh..."
                className="bg-transparent px-4 py-2 focus:outline-none text-sm w-44"
              />
              <button
                type="submit"
                className="text-gray-500 hover:text-[#0099CF] px-3 py-2 transition-colors"
              >
                <SearchOutlined />
              </button>
            </div>
          </div>

          {/* Search Icon - Mobile */}
          <button
            className="md:hidden text-gray-500 hover:text-[#0099CF] p-2"
            onClick={() => setSearchVisible(!searchVisible)}
          >
            <SearchOutlined className="text-lg" />
          </button>

          {/* User Profile/Login - All sizes */}
          {isLoggedIn ? (
            <div className="md:flex items-center gap-3 md:gap-6 md:show hidden">
              <Badge count={5} className="hidden sm:block">
                <button className="text-gray-500 hover:text-[#0099CF] p-1">
                  <BellOutlined className="text-xl md:text-2xl" />
                </button>
              </Badge>

              <Dropdown menu={userMenu} trigger={["click"]}>
                <div className="flex items-center cursor-pointer gap-1">
                  <Avatar
                    src={user?.image}
                    icon={!user?.image && <UserOutlined />}
                    size="default"
                  />
                  <CaretDownFilled className="text-gray-500 size-2.5 ml-1 hidden sm:block" />
                </div>
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

      {/* Mobile Search Bar */}
      {searchVisible && (
        <div className="md:hidden py-3 px-4 animate-fadeIn">
          <div className="flex items-center bg-gray-50 rounded-full overflow-hidden border border-gray-200">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="bg-transparent px-4 py-2 focus:outline-none text-sm w-full"
              autoFocus
            />
            <button
              type="submit"
              className="text-gray-500 hover:text-[#0099CF] px-3 py-2 transition-colors"
            >
              <SearchOutlined />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      <Drawer
        placement="right"
        onClose={() => setMenuVisible(false)}
        open={menuVisible}
        width={280}
        closeIcon={<CloseOutlined />}
        title={
          <div className="flex items-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#0099CF] mr-2"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.66898 3.92278C3.26824 4.06336 3 4.44172 3 4.86641V10.6607C3 16.2212 6.51216 21.1752 11.7592 23.0158C11.9151 23.0705 12.0849 23.0705 12.2408 23.0158C17.4878 21.1752 21 16.2212 21 10.6606V4.86641C21 4.44172 20.7318 4.06336 20.331 3.92278L12.331 1.11643C12.1167 1.04127 11.8833 1.04127 11.669 1.11643L3.66898 3.92278ZM12.3333 8.00031C12.8856 8.00031 13.3333 8.44803 13.3333 9.00031V10.567C13.3333 10.6222 13.3781 10.667 13.4333 10.667H15C15.5523 10.667 16 11.1147 16 11.667V12.3336C16 12.8859 15.5523 13.3336 15 13.3336H13.4333C13.3781 13.3336 13.3333 13.3784 13.3333 13.4336V15.0003C13.3333 15.5526 12.8856 16.0003 12.3333 16.0003H11.6667C11.1144 16.0003 10.6667 15.5526 10.6667 15.0003V13.4336C10.6667 13.3784 10.6219 13.3336 10.5667 13.3336H9C8.44772 13.3336 8 12.8859 8 12.3336V11.667C8 11.1147 8.44772 10.667 9 10.667H10.5667C10.6219 10.667 10.6667 10.6222 10.6667 10.567V9.00031C10.6667 8.44803 11.1144 8.00031 11.6667 8.00031H12.3333Z"
                fill="currentColor"
              />
            </svg>
            <span className="font-bold text-lg">Menu</span>
          </div>
        }
      >
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            {isLoggedIn && user && (
              <div className="mb-6 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-3 mb-2">
                  <Avatar
                    src={user.image}
                    icon={!user.image && <UserOutlined />}
                    size="large"
                  />
                  <div>
                    <p className="font-medium">
                      {user?.firtName} {user?.lastName}
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
                      onClick={() => navigate("/services/health-checkup")}
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
                  <li>
                    <a
                      className="block !text-gray-800 hover:text-[#0099CF]"
                      onClick={() => navigate("/services/appointments")}
                    >
                      Đặt lịch khám
                    </a>
                  </li>
                </ul>
              </li>

              <li>
                <a
                  className="block py-2 font-medium hover:text-[#0099CF] !text-gray-800"
                  onClick={() => navigate("/menstrual-cycle")}
                >
                  Theo dõi kỳ kinh
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
    </header>
  );
};

export default Header;
