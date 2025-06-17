import React from "react";
import { useNavigate } from "react-router-dom";
const doctor = {
    name: "BS. Nguyễn Thị Minh Trang",
    specialty: "Sản – Sức khỏe giới tính",
    image: "https://hthaostudio.com/wp-content/uploads/2022/08/Anh-profile-bac-si-min.jpg",
    experience: "Hơn 10 năm kinh nghiệm tại Bệnh viện Từ Dũ.",
    workingHistory: [
        "2012 – 2016: Bác sĩ điều trị tại Khoa Phụ Sản – Bệnh viện Từ Dũ",
        "2017 – 2020: Giảng viên bộ môn Sản phụ khoa tại Đại học Y Dược TP.HCM",
        "2021 – nay: Chuyên gia tư vấn sức khỏe giới tính tại Trung tâm Chăm sóc Sức khỏe Phụ nữ Việt",
    ],
    education: [
        "2007 – 2013: Tốt nghiệp Đại học Y Dược TP.HCM – Bác sĩ đa khoa",
        "2014 – 2016: Bác sĩ chuyên khoa cấp 1 – Sản phụ khoa",
        "2020: Chứng chỉ tư vấn tâm lý giới tính từ Viện Y học Giới tính Hoa Kỳ",
    ],
    strengths: [
        "Tư vấn sức khỏe sinh sản cho nữ giới mọi độ tuổi",
        "Chăm sóc sức khỏe tiền hôn nhân và tiền sản",
        "Điều trị rối loạn nội tiết nữ và các vấn đề kinh nguyệt",
        "Hỗ trợ tâm lý và y tế cho cộng đồng LGBTQ+",
        "Giáo dục giới tính và phòng tránh thai cho vị thành niên"
    ],
    license: {
        number: "123456/GCN-BYT",
        issueDate: "15/03/2015",
        issuedBy: "Sở Y tế TP.HCM",
    },
};

const MinhTrang = () => {
    const navigate = useNavigate();
    return (
        <div className="max-w-5xl mx-auto p-6 text-gray-800">
            <button
                onClick={() => navigate("/expert")}
                className="mb-4 text-blue-600 hover:text-blue-800 transition font-medium flex items-center">
                ← Quay lại danh sách bác sĩ
            </button>


            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-40 h-40 rounded-full object-cover"
                />
                <div>
                    <h1 className="text-2xl font-bold">{doctor.name}</h1>
                    <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                    <p className="mt-2 text-gray-600">{doctor.experience}</p>
                </div>
            </div>


            <div className="space-y-6">
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Quá trình công tác</h2>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                        {doctor.workingHistory.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Học vấn & Đào tạo</h2>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                        {doctor.education.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Thế mạnh chuyên môn</h2>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                        {doctor.strengths.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Chứng chỉ hành nghề</h2>
                    <p className="text-gray-700">Số chứng chỉ: {doctor.license.number}</p>
                    <p className="text-gray-700">Ngày cấp: {doctor.license.issueDate}</p>
                    <p className="text-gray-700">Nơi cấp: {doctor.license.issuedBy}</p>
                </section>
            </div>
        </div>
    );
};

export default MinhTrang;
