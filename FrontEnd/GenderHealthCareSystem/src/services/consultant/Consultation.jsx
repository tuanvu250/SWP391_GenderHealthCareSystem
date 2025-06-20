import React from "react";
import { useNavigate } from "react-router-dom";

import bacSi from "../../assets/bacsi.png";
import baomat from "../../assets/baomat.png";
import chiPhi from "../../assets/chiphi.png";
import hoTro from "../../assets/hotro.png";

export default function Consultation() {
    const navigate = useNavigate();

    return (
        <div className="bg-gradient-to-r from-sky-50 to-blue-100 overflow-hidden md:px-16 px-4">
            <div className="mx-auto pt-16 pb-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    {/* Left content */}
                    <div className="w-full lg:w-1/2 space-y-6">
                        <div className="inline-flex items-center bg-blue-100 px-4 py-2 rounded-full">
                            <span className="text-blue-800 font-semibold">
                                💬 Tư vấn sức khỏe
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
                            Tư vấn cùng <span className="text-[#0099CF]">Chuyên gia</span>
                        </h1>

                        <h2 className="text-2xl md:text-3xl font-semibold text-[#0099CF]">
                            Riêng tư & Nhanh chóng
                        </h2>

                        <p className="text-lg text-gray-600 max-w-lg">
                            Đặt lịch để trò chuyện với chuyên gia về sức khỏe giới tính, tâm lý,
                            các vấn đề nhạy cảm – riêng tư, bảo mật và không phán xét.
                        </p>

                        <div className="flex gap-4 pt-4">
                            <button
                                className="bg-[#0099CF] text-white font-semibold h-12 px-8 rounded-full shadow-md hover:bg-[#0088bb] transition"
                                onClick={() => navigate("/services/consultationbooking")}
                            >
                                Đặt lịch ngay
                            </button>
                        </div>

                        <div className="flex items-center gap-6 mt-8">
                            <div className="flex items-center gap-2">
                                <span>💻</span>
                                <span className="text-gray-700">Chat video bảo mật</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>⏱️</span>
                                <span className="text-gray-700">Phản hồi trong 24h</span>
                            </div>
                        </div>
                    </div>

                    {/* Right content */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="relative z-10 bg-white rounded-2xl p-8 shadow-xl">
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 mx-auto rounded-full border-4 border-blue-500 p-4 flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#0099CF" className="w-10 h-10">
                                        <path d="M12 21C12 21 19 16 19 10C19 5 15 2 12 2C9 2 5 5 5 10C5 16 12 21 12 21Z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Quy trình 4 bước đơn giản
                                </h3>
                                <p className="text-gray-600">
                                    Từ đặt lịch đến buổi tư vấn
                                </p>
                            </div>

                            <ol className="space-y-4 text-left">
                                <li className="flex items-start gap-3">
                                    <div className="text-[#0099CF] font-semibold text-2xl">1</div>
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            Chọn tư vấn viên
                                        </p>
                                        <p className="text-gray-500">
                                            Tìm người phù hợp với nhu cầu của bạn
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="text-[#0099CF] font-semibold text-2xl">2</div>
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            Điền thông tin
                                        </p>
                                        <p className="text-gray-500">
                                            Chia sẻ vấn đề & chọn thời gian phù hợp
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="text-[#0099CF] font-semibold text-2xl">3</div>
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            Chờ xác nhận
                                        </p>
                                        <p className="text-gray-500">
                                            Tư vấn viên xác nhận & gửi link hẹn
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="text-[#0099CF] font-semibold text-2xl">4</div>
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            Tham gia tư vấn
                                        </p>
                                        <p className="text-gray-500">
                                            Trò chuyện qua video call riêng tư, an toàn
                                        </p>
                                    </div>
                                </li>
                            </ol>
                        </div>

                        <div className="absolute -bottom-4 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-50"></div>
                        <div className="absolute -top-10 -left-10 w-20 h-20 bg-green-100 rounded-full opacity-50"></div>
                    </div>
                </div>
            </div>

            {/* Why Choose Section */}
            <div className="py-12 px-6 bg-gray-50 mb-30">
                <div className="max-w-5xl px-4 sm:px-6 lg:px-8 mx-auto">
                    <div className="text-center mb-10">
                        <span className="text-sm font-semibold text-[#0099CF] uppercase tracking-wider">
                            Tại sao nên tư vấn cùng tư vấn viên tại Gender Healthcare?
                        </span>
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-2">
                            Những ưu thế mà bạn sẽ hài lòng
                        </h2>
                        <div className="w-16 h-1 bg-[#0099CF] mx-auto mt-4 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4 p-6 bg-white rounded-xl border border-blue-100 shadow-sm">
                            <div className="flex-shrink-0 w-14 h-14 rounded-full border border-blue-400 p-2 flex items-center justify-center">
                                <img src={baomat} alt="Bảo mật" className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-base font-semibold text-gray-800">
                                    Bảo mật thông tin y tế
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Cung cấp sự riêng tư hàng đầu, bạn hoàn toàn yên tâm khi tâm sự với bác sĩ.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 bg-white rounded-xl border border-blue-100 shadow-sm">
                            <div className="flex-shrink-0 w-14 h-14 rounded-full border border-blue-400 p-2 flex items-center justify-center">
                                <img src={bacSi} alt="Bác sĩ" className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-base font-semibold text-gray-800">
                                    Đội ngũ bác sĩ chuyên môn cao
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Với hơn 20+ bác sĩ tại các bệnh viện lớn luôn đồng hành cùng bạn.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 bg-white rounded-xl border border-blue-100 shadow-sm">
                            <div className="flex-shrink-0 w-14 h-14 rounded-full border border-blue-400 p-2 flex items-center justify-center">
                                <img src={chiPhi} alt="Chi phí" className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-base font-semibold text-gray-800">
                                    Tiết kiệm chi phí
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Chi phí chỉ bằng một phần nhỏ so với trực tiếp tại bệnh viện.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 bg-white rounded-xl border border-blue-100 shadow-sm">
                            <div className="flex-shrink-0 w-14 h-14 rounded-full border border-blue-400 p-2 flex items-center justify-center">
                                <img src={hoTro} alt="Hỗ trợ" className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-base font-semibold text-gray-800">
                                    Hỗ trợ khách hàng sau tư vấn
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Đội ngũ luôn đồng hành, hướng dẫn nếu bạn có nhu cầu hoặc khó khăn sau khi tư vấn.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section – Tư vấn sức khỏe giới tính */}
            <div className="pt-6 pb-12 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
                        Một số câu hỏi thường gặp khi tư vấn sức khỏe giới tính tại Gender Healthcare
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8 text-gray-700 text-sm leading-relaxed">
                        <div>
                            <h3 className="font-semibold text-base mb-1">
                                ▶ Tư vấn giới tính online có gì khác so với khám trực tiếp?
                            </h3>
                            <p>
                                Tư vấn online giúp bạn được trao đổi riêng tư, kín đáo qua tin nhắn hoặc video call với bác sĩ.
                                Hình thức này đặc biệt phù hợp khi bạn chưa sẵn sàng đến bệnh viện, giúp tiết kiệm thời gian, chi phí và giữ sự riêng tư tối đa.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-base mb-1">
                                ▶ Tôi có thể hỏi bác sĩ về những vấn đề nhạy cảm như "xu hướng tính dục" không?
                            </h3>
                            <p>
                                Hoàn toàn được. Bác sĩ tại Gender Healthcare được đào tạo chuyên sâu về tư vấn giới tính, tâm lý, sức khỏe sinh sản và sẽ hỗ trợ bạn với sự thấu hiểu, không phán xét.
                                Bạn có thể trao đổi mọi thắc mắc một cách riêng tư và an toàn.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-base mb-1">
                                ▶ Nếu tôi không thoải mái bật camera, vẫn có thể tư vấn được không?
                            </h3>
                            <p>
                                Bạn có thể chọn hình thức nhắn tin hoặc gọi thoại, hoàn toàn không bắt buộc mở video.
                                Gender Healthcare tôn trọng quyền riêng tư và cảm xúc của người dùng trong quá trình tư vấn.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-base mb-1">
                                ▶ Bác sĩ có hỗ trợ tư vấn cho cộng đồng LGBT+ không?
                            </h3>
                            <p>
                                Có. Chúng tôi có đội ngũ bác sĩ, chuyên gia am hiểu và hỗ trợ các vấn đề liên quan đến định hướng tính dục, bản dạng giới, hormone, can thiệp y tế,... dành cho người thuộc cộng đồng LGBT+.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-base mb-1">
                                ▶ Nếu không kết nối được với bác sĩ thì tôi có được hoàn tiền không?
                            </h3>
                            <p>
                                Trong trường hợp hệ thống không kết nối thành công hoặc bác sĩ không thể tiếp nhận ca tư vấn, bạn sẽ được hoàn tiền 100%.
                                Hệ thống sẽ thông báo cho bạn sớm và hỗ trợ đổi ca nếu cần.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-base mb-1">
                                ▶ Gender Healthcare có lưu lại lịch sử tư vấn của tôi không?
                            </h3>
                            <p>
                                Lịch sử tư vấn chỉ được lưu trữ dưới dạng bảo mật để bác sĩ theo dõi tiến trình của bạn nếu có hẹn tái tư vấn.
                                Dữ liệu được mã hóa theo tiêu chuẩn y tế, và bạn có thể yêu cầu xóa bất cứ lúc nào.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
