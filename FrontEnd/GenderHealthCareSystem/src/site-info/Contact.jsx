import React from "react";
import { useNavigate } from "react-router-dom";

const ContactSection = () => {
    const navigate = useNavigate();

    return (
        <>
            {/* Menu NAVBAR */}
            <div className="px-8 py-12 max-w-7xl mx-auto text-gray-800">
                <nav className="hidden lg:block">
                    <ul className="flex space-x-8 font-medium text-[#a6acaf]">
                        <li className="hover:text-[#909497] cursor-pointer py-2 ">
                            <a onClick={() => navigate("/about")}>Giới thiệu</a>
                        </li>
                        <li className="hover:text-[#909497] cursor-pointer py-2 ">
                            <a onClick={() => navigate("/servicelist")}>Dịch vụ</a>
                        </li>
                        <li className="hover:text-[#909497] cursor-pointer py-2 ">
                            <a onClick={() => navigate("/expert")}>Chuyên gia</a>
                        </li>
                        <li className="hover:text-[#909497] cursor-pointer py-2 ">
                            <a onClick={() => navigate("/privacy")}>Chính sách</a>
                        </li>
                        <li className="hover:text-[#909497] cursor-pointer py-2 text-blue-600 font-semibold border-b-2 border-blue-600 ">
                            <a onClick={() => navigate("/contact")}>Liên hệ</a>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Nội dung LIÊN HỆ */}
            <section className="bg-white px-4 mb-10">
                <div className="max-w-4xl mx-auto px-6 space-y-10">
                    <h2 className="text-3xl font-bold text-gray-900 text-center">Liên hệ</h2>
                    <p className="text-gray-700 leading-relaxed text-center">
                        Chúng tôi luôn muốn lắng nghe ý kiến của bạn! Liên hệ với chúng tôi
                        theo địa chỉ email bên dưới nếu bạn muốn góp ý nội dung
                        hoặc phản hồi về các chính sách, dịch vụ của chúng tôi.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <h3 className="text-xl font-semibold text-black mb-2">Địa chỉ</h3>
                            <address className="not-italic text-gray-700 leading-relaxed mb-6">
                                D. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh
                            </address>

                            {/* Google Map iframe */}
                            <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden shadow-md">
                                <iframe
                                    title="Bản đồ Đại học FPT HCM"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2630304621476!2d106.73069061462255!3d10.858072292263347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175282efbeffb17%3A0x3766b9ff7b4d0238!2zVMOibSBUaOG7iyBGUFQgSOG7kyBDw7RuZyBIw6AgQ2jDrSBNaW5o!5e0!3m2!1svi!2s!4v1686550039391!5m2!1svi!2s"
                                    width="100%"
                                    height="300"
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="border-0 w-full h-full"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-black-700 mb-2">
                                Thông tin liên hệ
                            </h3>
                            <p className="text-gray-700 mb-1">
                                1900-2805 (8:00 - 17:30 từ T2 đến T7)
                            </p>
                            <a
                                href="mailto:support@genderhealthcare.com"
                                className="text-blue-600 hover:underline"
                            >
                                support@genderhealthcare.com
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ContactSection;
