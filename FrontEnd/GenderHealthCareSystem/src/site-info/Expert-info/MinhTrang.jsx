import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillBank } from "react-icons/ai";

const doctor = {
    name: "BS.CKI Nguyễn Thị Minh Trang",
    subtitle: "“Sự hài lòng của bạn là động lực của tôi”",
    specialty: "Chuyên gia Sản - Sức khỏe giới tính",
    workplace: "Phòng khám Chuyên khoa Sản phụ khoa – Sức khỏe giới tính TP.HCM",
    image: "https://hthaostudio.com/wp-content/uploads/2022/08/Anh-profile-bac-si-min.jpg",
    consultationPrice: { old: 129000, new: 79000 },
    metrics: {
        consults: "1.250+",
        experience: "12 năm",
        rating: "98%",
    },
    detail: `BS. CKI Nguyễn Thị Minh Trang là chuyên gia Sản phụ khoa với hơn 12 năm kinh nghiệm trong lĩnh vực tư vấn sức khỏe giới tính, chăm sóc sinh sản, điều hòa nội tiết và các vấn đề liên quan đến kinh nguyệt. Bác sĩ từng công tác tại nhiều cơ sở y tế uy tín và luôn được đánh giá cao bởi sự tận tâm và chuyên môn vững vàng.`,
    workingHistory: [
        "2011 – 2015: Bác sĩ điều trị tại Bệnh viện Hùng Vương",
        "2016 – 2020: Bác sĩ tư vấn tại Bệnh viện Đại học Y Dược TP.HCM",
        "2021 – nay: Chuyên gia tư vấn tại Phòng khám Sản phụ khoa & SKGT TP.HCM",
    ],
    education: [
        "2005 – 2011: ĐH Y Dược TP.HCM – Bác sĩ đa khoa",
        "2012 – 2014: Chuyên khoa cấp 1 – Sản phụ khoa",
        "2019: Chứng chỉ đào tạo Tư vấn tâm lý giới tính – Viện Giới và Phát triển",
    ],
    license: {
        number: "456789/GCN-BYT",
        issueDate: "10/04/2014",
        issuedBy: "Sở Y tế TP.HCM",
    },
    feedback: [
        { user: "User20301", date: "03/03/2024", content: "Bác sĩ nhẹ nhàng, dễ hiểu và rất tâm lý." },
        { user: "User98241", date: "22/08/2023", content: "Giải thích chi tiết và rất tận tâm, cảm ơn bác sĩ nhiều!" },
        { user: "User67854", date: "10/12/2023", content: "Rất hài lòng với cách tư vấn của bác sĩ Trang." },
    ],
};

const MinhTrang = () => {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const selectedExpert = doctor;

    const handleCloseForm = () => {
        setShowForm(false);
    };

    const handleSubmitBooking = (e) => {
        e.preventDefault();
        setShowForm(false);
        setSuccessModal(true);
        setTimeout(() => {
            navigate("/confirm-consultant");
        }, 2000);

    };
    
    return (
        <div className="max-w-6xl mx-auto p-6 text-gray-800">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-[#0099CF] hover:text-[#0077aa] font-medium"
            >
                ← Quay lại
            </button>

            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6 mb-8">
                <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-40 h-40 object-cover rounded-full"
                />
                <div className="flex-1 space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
                    <p className="text-sm italic text-gray-600">{doctor.subtitle}</p>
                    <p className="text-[#0099CF] font-medium">{doctor.specialty}</p>
                    <p className="text-gray-700 text-sm">Địa chỉ công tác: {doctor.workplace}</p>

                    <div className="flex items-center gap-2 mt-2">
                        <span className="line-through text-sm text-gray-400">
                            {doctor.consultationPrice.old.toLocaleString()} đ
                        </span>
                        <span className="text-lg font-bold text-[#0099CF]">
                            {doctor.consultationPrice.new.toLocaleString()} đ
                        </span>
                        <span className="text-sm text-green-600">
                            Giảm 50K cho đơn đầu tiên
                        </span>
                    </div>

                    <button
                        onClick={() => setShowForm(true)}
                        className="mt-3 px-4 py-2 bg-[#0099CF] hover:bg-[#0077aa] text-white rounded font-medium transition"
                    >
                        ĐẶT TƯ VẤN
                    </button>
                </div>

                <div className="flex flex-col justify-around text-center text-sm text-gray-600">
                    <div>
                        <p className="font-bold text-lg text-[#0099CF]">{doctor.metrics.consults}</p>
                        <p>Lượt tư vấn</p>
                    </div>
                    <div>
                        <p className="font-bold text-lg text-[#0099CF]">{doctor.metrics.experience}</p>
                        <p>Kinh nghiệm</p>
                    </div>
                    <div>
                        <p className="font-bold text-lg text-[#0099CF]">{doctor.metrics.rating}</p>
                        <p>Hài lòng</p>
                    </div>
                </div>
            </div>

            {/* Detail Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div>
                    <h2 className="text-xl font-semibold mb-2">Thông tin chi tiết</h2>
                    <p className="text-gray-700 text-sm leading-relaxed">{doctor.detail}</p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">Quá trình công tác</h2>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
                        {doctor.workingHistory.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">Học vấn</h2>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
                        {doctor.education.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">Chứng chỉ hành nghề</h2>
                    <p className="text-gray-700 text-sm">Số: {doctor.license.number}</p>
                    <p className="text-gray-700 text-sm">Ngày cấp: {doctor.license.issueDate}</p>
                    <p className="text-gray-700 text-sm">Nơi cấp: {doctor.license.issuedBy}</p>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">Đánh giá của khách hàng</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {doctor.feedback.map((item, i) => (
                        <div key={i} className="bg-gray-50 p-4 rounded shadow text-sm">
                            <p className="font-medium">{item.user} <span className="text-gray-400">({item.date})</span></p>
                            <p className="mt-1 text-gray-700">{item.content}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Popup Booking Form */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-2xl relative animate-fade-in-up">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
                            onClick={handleCloseForm}
                        >
                            ✕
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                            <img
                                src={selectedExpert.image}
                                alt={selectedExpert.name}
                                className="w-16 h-16 rounded-full object-cover ring-2 ring-[#0099CF]"
                            />
                            <div>
                                <h3 className="text-xl font-bold text-[#0099CF]">{selectedExpert.name}</h3>
                                <p className="text-gray-600 text-sm">{selectedExpert.specialty}</p>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold mb-4 text-[#0099CF]">Đặt lịch tư vấn</h3>

                        <form className="space-y-4" onSubmit={handleSubmitBooking}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" name="fullName" placeholder="Họ và tên *" required className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF]" />
                                <input type="tel" name="phone" placeholder="Số điện thoại *" required className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF]" />
                            </div>
                            <input type="email" name="email" placeholder="Email (Tùy chọn)" className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF]" />
                            <input type="date" name="date" required className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF]" />
                            <select
                                name="timeSlot"
                                required
                                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF]"
                            >
                                <option value="">-- Chọn khung giờ tư vấn *</option>
                                <option value="08:00 - 09:00">08:00 - 09:00</option>
                                <option value="09:00 - 10:00">09:00 - 10:00</option>
                                <option value="10:00 - 11:00">10:00 - 11:00</option>
                                <option value="13:30 - 14:30">13:30 - 14:30</option>
                                <option value="15:00 - 16:00">15:00 - 16:00</option>
                                <option value="16:30 - 17:30">16:30 - 17:30</option>
                            </select>
                            <div className="space-y-4">

                                <label className="flex items-start border rounded-lg p-4 cursor-pointer transition hover:shadow-md">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="bank"
                                        className="mt-1.5 accent-[#0099CF]"
                                        required
                                    />
                                    <div className="ml-3">
                                        <div className="flex items-center space-x-2 text-gray-800 font-semibold">
                                            <AiFillBank className="text-xl " />
                                            <span>Thanh toán trực tuyến</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Thanh toán bằng ATM/Visa/MasterCard/QR Code
                                        </p>
                                    </div>
                                </label>
                            </div>

                            <textarea name="notes" rows={3} placeholder="Ghi chú thêm (nếu có)" className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF]"></textarea>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={handleCloseForm} className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300">Hủy</button>
                                <button type="submit" className="bg-[#0099CF] text-white px-6 py-2 rounded-lg hover:bg-[#0077aa]">Xác nhận đặt lịch</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {successModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white p-6 rounded-xl shadow-xl text-center">
                        <h2 className="text-xl font-semibold text-[#0099CF] mb-3">Đặt lịch thành công!</h2>
                        <p className="text-gray-700">Bạn sẽ được chuyển đến trang thanh toán...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MinhTrang;
