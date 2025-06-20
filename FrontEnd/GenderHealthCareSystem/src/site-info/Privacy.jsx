import React from "react";
import { useNavigate } from "react-router-dom";

const PrivacySection = () => {
    const navigate = useNavigate();

    return (
        <>
            {/* Navbar */}
            <div className="px-8 py-12 max-w-7xl mx-auto text-gray-800">
                <nav className="hidden lg:block">
                    <ul className="flex space-x-8 font-medium text-[#a6acaf]">
                        <li className="hover:text-[#909497] cursor-pointer py-2">
                            <a onClick={() => navigate("/about")}>Giới thiệu</a>
                        </li>
                        <li className="hover:text-[#909497] cursor-pointer py-2">
                            <a onClick={() => navigate("/servicelist")}>Dịch vụ</a>
                        </li>
                        <li className="hover:text-[#909497] cursor-pointer py-2">
                            <a onClick={() => navigate("/expert")}>Chuyên gia</a>
                        </li>
                        <li className="text-blue-600 font-semibold border-b-2 border-blue-600 py-2 cursor-pointer">
                            <a onClick={() => navigate("/privacy")}>Chính sách</a>
                        </li>
                        <li className="hover:text-[#909497] cursor-pointer py-2">
                            <a onClick={() => navigate("/contact")}>Liên hệ</a>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Chính sách content */}
            <section className="bg-white px-4 mb-20">
                <div className="max-w-4xl mx-auto px-6 space-y-10">
                    <h2 className="text-3xl font-bold text-gray-900 text-center">Chính sách</h2>

                    <div className="text-gray-700 leading-relaxed space-y-5">
                        <p>
                            Gender Healthcare cam kết cung cấp những thông tin sức khỏe và y tế trực tuyến hữu ích
                            cho tất cả mọi người. Chúng tôi hy vọng rằng nội dung từ Gender Healthcare sẽ hỗ trợ bạn đọc
                            đưa ra quyết định tốt nhất có thể khi chăm sóc sức khỏe của họ và người thân.
                        </p>
                        <p>
                            Mỗi nội dung đăng tải đều trải qua quá trình đánh giá chuyên môn chặt chẽ từ các chuyên
                            gia có chuyên môn liên quan để đảm bảo tính chính xác. Chúng tôi có các nguyên tắc
                            tìm kiếm nguồn thông tin nghiêm ngặt, trích dẫn hoặc liên kết đến các nguồn chính trong
                            mỗi bài viết.
                        </p>
                        <p>
                            Các chuyên gia của chúng tôi liên tục theo dõi tin tức và nghiên cứu về sức khỏe, đồng
                            thời chúng tôi cũng cập nhật các nội dung khi có thông tin mới.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default PrivacySection;
