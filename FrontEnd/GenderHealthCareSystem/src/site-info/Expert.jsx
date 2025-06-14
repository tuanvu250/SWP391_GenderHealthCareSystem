import { useState } from "react";


const advisors = [
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

export default function ConsultationBooking() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Đặt lịch tư vấn cùng chuyên gia</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {advisors.map((advisor, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-2xl overflow-hidden border hover:shadow-lg transition duration-300"
          >
            <img src={advisor.image} alt={advisor.name} className="w-full h-60 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{advisor.name}</h2>
              <p className="text-indigo-600 font-medium">{advisor.specialty}</p>
              <p className="text-gray-600 mt-1 text-sm">{advisor.desc}</p>
              <button
                onClick={() => setSelected(advisor.name)}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Đặt lịch
              </button>
              {selected === advisor.name && (
                <p className="mt-2 text-green-600 text-sm">✔ Đã chọn chuyên gia này</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
