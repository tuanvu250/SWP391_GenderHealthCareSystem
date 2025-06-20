import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const experts = [
  {
    name: "BS. Nguyễn Thị Minh Trang",
    specialty: "Sản – Sức khỏe giới tính",
    desc: "Hơn 10 năm kinh nghiệm tại Bệnh viện Từ Dũ.",
    image: "https://hthaostudio.com/wp-content/uploads/2022/08/Anh-profile-bac-si-min.jpg",

  },
  {
    name: "TS. Lê Anh Tuấn",
    specialty: "Nam khoa – Tâm lý giới",
    desc: "Chuyên điều trị rối loạn hormone giới tính.",
    image: "https://hthaostudio.com/wp-content/uploads/2022/03/Anh-bac-si-nam-7-min.jpg.webp",
  },
  {
    name: "ThS. Bùi Thị Hồng Ánh",
    specialty: "LGBTQ+ – Tư vấn cộng đồng",
    desc: "Từng cộng tác với nhiều tổ chức về quyền giới.",
    image: "https://images2.thanhnien.vn/thumb_w/686/528068263637045248/2024/3/7/41498385661961282804899348165590311304931596n-17098051418122006775403-0-286-2048-1822-crop-1709805739243640175866.jpg",
  },
  {
    name: "BS. CKI. Vũ Thị Lan",
    specialty: "Sản khoa vị thành niên",
    desc: "Chăm sóc sức khỏe sinh sản cho tuổi teen.",
    image: "https://studiochupanhdep.com/Upload/Images/Album/anh-bac-sy-04.jpg",
  },
  {
    name: "BS. Trần Văn Hòa",
    specialty: "Nam học, Vô sinh hiếm muộn",
    desc: "Chuyên điều trị vô sinh nam.",
    image: "https://htmediagroup.vn/wp-content/uploads/2022/12/Anh-bac-si-12-min-585x878.jpg.webp",
  },
  {
    name: "PGS.TS. Lưu Thị Hằng",
    specialty: "Phụ khoa, Nội tiết nữ",
    desc: "Giảng viên ĐH Y Hà Nội – 15 năm kinh nghiệm.",
    image: "https://htmediagroup.vn/wp-content/uploads/2022/09/Anh-bac-si-nu-1-min.jpg.webp",
  },
  {
    name: "ThS. Nguyễn Minh Quân",
    specialty: "Tư vấn tâm lý giới tính",
    desc: "Tổ chức workshop về giáo dục giới tính.",
    image: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/12/25/1-17035025379211648167770.png",
  },
  {
    name: "ThS. Đỗ Văn Hùng",
    specialty: "Sức khỏe tình dục nam giới",
    desc: "Điều trị rối loạn cương – xuất tinh sớm.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6vkLej_bKmmM-GsfU1rf5XLloXPOr79PyAg&s",
  },
  {
    name: "BS. Nguyễn Hồng Phúc",
    specialty: "Nội tiết – Giới tính",
    desc: "Tư vấn nội tiết cho người chuyển giới.",
    image: "https://watermark.lovepik.com/photo/20211201/large/lovepik-male-doctor-image-picture_501367339.jpg",
  },
  {
    name: "BS. Nguyễn Thị Mỹ Linh",
    specialty: "Tiền hôn nhân, Sinh sản",
    desc: "Tư vấn sức khỏe cho cặp đôi trước hôn nhân.",
    image: "https://media.sohuutritue.net.vn/files/huongmi/2023/01/27/bsi-pham-ly-0853.jpg",
  },
  {
    name: "ThS. Phạm Quốc Khánh",
    specialty: "Tâm lý giới và gia đình",
    desc: "Hỗ trợ tâm lý quan hệ đồng – chuyển giới.",
    image: "https://bizweb.dktcdn.net/100/175/849/files/z4277781980584-afef6aa4d11e23c78d25762713d84b0a.jpg?v=1681895248409",
  },
  {
    name: "BS. Hà Ngọc Mai",
    specialty: "Phụ khoa – Ung thư cổ tử cung",
    desc: "Sàng lọc & điều trị ung thư phụ khoa.",
    image: "https://images2.thanhnien.vn/thumb_w/686/528068263637045248/2023/10/24/10a6-1698154683405869534195-0-162-1027-932-crop-16981547713202103999695.jpg",
  },
  {
    name: "BS. Bùi Thị Minh Trang",
    specialty: "Sản khoa – Sinh sản",
    desc: "Chăm sóc thai kỳ và sản khoa.",
    image: "https://honghunghospital.com.vn/wp-content/uploads/2022/02/85.-L%C3%AA-Ph%E1%BA%A1m-Qu%E1%BB%B3nh-Trang-scaled.jpg",
  },
  {
    name: "ThS. Vũ Quốc Việt",
    specialty: "Tâm lý trẻ em & giới tính",
    desc: "Giúp phụ huynh giáo dục giới tính cho trẻ.",
    image: "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/anh-bac-si-27.jpg",
  },
  {
    name: "BS. Lê Kim Dung",
    specialty: "Phụ khoa – Nội tiết",
    desc: "Chăm sóc và điều trị các rối loạn nội tiết.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYOOi8yOwsMCPm8VkL7BEdLsVBnZu1HOBvlw&s",
  },
];

const ExpertSection = () => {
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
            <li className="text-blue-600 font-semibold border-b-2 border-blue-600 py-2 cursor-pointer">
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

      {/* Experts content */}
      <section className="bg-white px-4 py-12">
        <div className="max-w-7xl mx-auto px-6 space-y-10 text-gray-800">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Đội ngũ chuyên gia về sức khỏe giới tính
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto">
            Gender Healthcare quy tụ đội ngũ bác sĩ, chuyên gia hàng đầu trong lĩnh vực sức khỏe giới tính, LGBTQ+ và chăm sóc sinh sản.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {experts.map((expert, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 shadow hover:shadow-md transition duration-300"
              >
                <img
                  src={expert.image}
                  alt={expert.name}
                  className="w-24 h-24 rounded-full object-cover mb-4 mx-auto"
                />
                <h3 className="text-lg font-semibold text-center text-gray-900">
                  {expert.name}
                </h3>
                <p className="text-center text-sm text-blue-600 mb-2">
                  {expert.specialty}
                </p>
                <p className="text-sm text-gray-700 text-center">{expert.desc}</p>
                <div className="flex justify-center">
                  <Button
                    type="primary"
                    className="mt-4"
                    onClick={() => navigate(`/expert/${index}`)}
                  >
                    Thông tin chi tiết
                  </Button>
                </div>
              </div>

            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ExpertSection;
