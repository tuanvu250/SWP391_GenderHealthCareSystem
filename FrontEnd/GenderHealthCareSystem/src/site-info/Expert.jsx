import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { getAllConsultants } from "../components/api/Consultant.api";

const ExpertSection = () => {
  const [experts, setExperts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const data = await getAllConsultants();
        const mappedExperts = data.map((e, index) => ({
          ...e,
          id: e.id ?? e.consultantId ?? e.userId ?? index,
        }));
        setExperts(mappedExperts);
        localStorage.setItem("consultants", JSON.stringify(mappedExperts));
      } catch (err) {
        console.error("Lỗi khi tải danh sách chuyên gia", err);
      }
    };
    fetchExperts();
  }, []);

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
            <li className="hover:text-[#909497] cursor-pointer py-2 text-[#0099CF] font-semibold border-b-2 border-[#0099CF]">
              <a onClick={() => navigate("/expert")}>Chuyên gia</a>
            </li>
            <li className="hover:text-[#909497] cursor-pointer py-2">
              <a onClick={() => navigate("/privacy")}>Chính sách</a>
            </li>
            <li className="hover:text-[#909497] cursor-pointer py-2">
              <a onClick={() => navigate("/contact")}>Liên hệ</a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Experts */}
      <section className="bg-white px-4 py-12">
        <div className="max-w-7xl mx-auto px-6 space-y-10 text-gray-800">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Đội ngũ chuyên gia về sức khỏe giới tính
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto">
            Gender Healthcare quy tụ đội ngũ bác sĩ, chuyên gia hàng đầu trong lĩnh vực sức khỏe giới tính, LGBTQ+ và chăm sóc sinh sản.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {experts.length === 0 ? (
              <p className="text-center col-span-full">Đang tải dữ liệu...</p>
            ) : (
              experts.map((expert, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-6 shadow hover:shadow-md transition duration-300"
                >
                  {expert.userImageUrl ? (
                    <img
                      src={expert.userImageUrl}
                      alt={expert.fullName}
                      className="w-24 h-24 rounded-full object-cover mb-4 mx-auto"
                    />
                  ) : (
                    <div className="w-24 h-24 mx-auto rounded-full bg-[#f0f0f0] flex items-center justify-center text-xl font-bold text-[#0099CF] mb-4">
                      {expert.fullName?.charAt(0) || "?"}
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-center text-gray-900">
                    {expert.fullName}
                  </h3>
                  <p className="text-center text-sm text-blue-600 mb-2">
                    {expert.jobTitle}
                  </p>
                  <p className="text-sm text-gray-700 text-center">{expert.description || "Chuyên gia sức khỏe giới tính."}</p>
                  <div className="flex justify-center">
                    <Button
                      type="primary"
                      className="mt-4"
                      onClick={() =>
                        navigate(`/expert/${expert.id}`, { state: expert })
                      }
                    >
                      Thông tin chi tiết
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ExpertSection;
