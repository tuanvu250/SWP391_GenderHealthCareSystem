import {useNavigate} from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const handleNavigation = (path) => {
        navigate(path);
    };
    return (
         <header className="bg-white z-50  px-4 text-gray-800 py-3 shadow-sm sticky top-0 border-b border-gray-100">
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Logo */}
          <a className="flex items-center space-x-2" onClick={() => handleNavigation('/home')}>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#0099CF]"
            >
              <path 
                fill-rule="evenodd" 
                clip-rule="evenodd" 
                d="M3.66898 3.92278C3.26824 4.06336 3 4.44172 3 4.86641V10.6607C3 16.2212 6.51216 21.1752 11.7592 23.0158C11.9151 23.0705 12.0849 23.0705 12.2408 23.0158C17.4878 21.1752 21 16.2212 21 10.6606V4.86641C21 4.44172 20.7318 4.06336 20.331 3.92278L12.331 1.11643C12.1167 1.04127 11.8833 1.04127 11.669 1.11643L3.66898 3.92278ZM12.3333 8.00031C12.8856 8.00031 13.3333 8.44803 13.3333 9.00031V10.567C13.3333 10.6222 13.3781 10.667 13.4333 10.667H15C15.5523 10.667 16 11.1147 16 11.667V12.3336C16 12.8859 15.5523 13.3336 15 13.3336H13.4333C13.3781 13.3336 13.3333 13.3784 13.3333 13.4336V15.0003C13.3333 15.5526 12.8856 16.0003 12.3333 16.0003H11.6667C11.1144 16.0003 10.6667 15.5526 10.6667 15.0003V13.4336C10.6667 13.3784 10.6219 13.3336 10.5667 13.3336H9C8.44772 13.3336 8 12.8859 8 12.3336V11.667C8 11.1147 8.44772 10.667 9 10.667H10.5667C10.6219 10.667 10.6667 10.6222 10.6667 10.567V9.00031C10.6667 8.44803 11.1144 8.00031 11.6667 8.00031H12.3333Z" 
                fill="currentColor"
              />
            </svg>

            <span className="font-bold text-xl text-[#0099CF]">HealthCare</span>
          </a>
          
          {/* Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8 font-medium">
              <li className="hover:text-[#0099CF] cursor-pointer transition-colors border-b-2 border-transparent hover:border-[#0099CF] py-2"><a onClick={() => handleNavigation('/home')}>Trang chủ</a></li>
              <li className="hover:text-[#0099CF] cursor-pointer transition-colors border-b-2 border-transparent hover:border-[#0099CF] py-2"><a>Dịch vụ</a></li>
              <li className="hover:text-[#0099CF] cursor-pointer transition-colors border-b-2 border-transparent hover:border-[#0099CF] py-2"><a>Giới thiệu</a></li>
              <li className="hover:text-[#0099CF] cursor-pointer transition-colors border-b-2 border-transparent hover:border-[#0099CF] py-2"><a>Blog</a></li>
            </ul>
          </nav>

          {/* Search and Login */}
          <div className="flex items-center space-x-3">
            {/* Search Bar */}
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16" 
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Login Button */}
            <button 
              className="px-8 py-2 bg-[#0099CF] text-white rounded-full hover:bg-[#0088bb] font-medium shadow-sm transition-colors text-sm"
              onClick={() => handleNavigation('/login')}
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </header>
    );
};

export default Header;