import React, { useState } from "react";

export default function AskingSection() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        question: "",
        tag: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [myQuestions, setMyQuestions] = useState([]);
    const [selectedTag, setSelectedTag] = useState("all");
    const [searchText, setSearchText] = useState("");

    const tagOptions = [
        { label: "Sức Khỏe", value: "suckhoe" },
        { label: "Giới tính", value: "gioitinh" },
        { label: "Tư vấn", value: "tuvan" },
        { label: "STIs", value: "stis" },
        { label: "Kinh nguyệt", value: "kinhnguyet" },
    ];

    const answeredQuestions = [
        {
            customerName: "Mai", tag: "kinhnguyet", consultantName: "TVV A",
            question: "Kinh nguyệt không đều có ảnh hưởng mang thai không?",
            answer: "Có thể ảnh hưởng đến rụng trứng và khả năng mang thai."
        },
        {
            customerName: "An", tag: "kinhnguyet", consultantName: "TVV B",
            question: "Em bị trễ kinh 10 ngày, có sao không?",
            answer: "Trễ kinh có thể do stress, mang thai hoặc bệnh lý. Cần test thử thai."
        },
        {
            customerName: "Chi", tag: "suckhoe", consultantName: "TVV C",
            question: "Em từng phá thai, ảnh hưởng đến sinh sản không?",
            answer: "Nếu đúng cách và chăm sóc tốt thì không ảnh hưởng nhiều."
        },
        {
            customerName: "Linh", tag: "suckhoe", consultantName: "TVV D",
            question: "Em hay bị đau bụng dưới, có phải viêm gì không?",
            answer: "Có thể là viêm nhiễm phụ khoa. Nên đi khám để chẩn đoán chính xác."
        },
        {
            customerName: "Tuấn", tag: "gioitinh", consultantName: "TVV E",
            question: "Dùng thuốc tránh thai rồi có cần dùng bao không?",
            answer: "Vẫn nên dùng bao để phòng bệnh lây qua đường tình dục."
        },
        {
            customerName: "Hà", tag: "gioitinh", consultantName: "TVV F",
            question: "Nam giới có cần kiểm tra sức khỏe sinh sản không?",
            answer: "Có, đặc biệt khi lập gia đình hoặc gặp vấn đề sinh lý."
        },
        {
            customerName: "Nam", tag: "stis", consultantName: "TVV G",
            question: "Quan hệ xong thấy ngứa, có phải bệnh lây không?",
            answer: "Có thể là triệu chứng STIs. Nên đi khám sớm."
        },
        {
            customerName: "Vy", tag: "stis", consultantName: "TVV H",
            question: "Có test nhanh nào phát hiện HIV không?",
            answer: "Có test nhanh tại các trung tâm y tế sau 3-6 tuần quan hệ."
        },
        {
            customerName: "Minh", tag: "tuvan", consultantName: "TVV I",
            question: "Em chưa có người yêu, có cần khám phụ khoa không?",
            answer: "Khuyến nghị khám định kỳ 6 tháng/lần dù chưa quan hệ."
        },
        {
            customerName: "Tú", tag: "tuvan", consultantName: "TVV J",
            question: "Tư vấn giúp em cách tránh thai an toàn nhất?",
            answer: "Bao cao su + thuốc tránh thai uống là hiệu quả nhất."
        },
        ...Array.from({ length: 10 }).map((_, i) => ({
            customerName: `User${i + 1}`,
            tag: tagOptions[i % tagOptions.length].value,
            consultantName: `TVV ${i + 1}`,
            question: `Đây là câu hỏi số ${i + 1} về chủ đề ${tagOptions[i % tagOptions.length].label}`,
            answer: `Đây là câu trả lời cho câu hỏi số ${i + 1}.`,
        }))
    ];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newQuestion = { ...form, answer: null, status: "pending" };
        setMyQuestions([...myQuestions, newQuestion]);
        setSubmitted(true);
        setForm({ name: "", email: "", question: "", tag: "" });
        setTimeout(() => setSubmitted(false), 3000);
    };

    const filteredAnswered = answeredQuestions.filter((q) => {
        const matchTag = selectedTag === "all" || q.tag === selectedTag;
        const search = searchText.toLowerCase();
        const matchSearch =
            q.question.toLowerCase().includes(search) ||
            q.customerName.toLowerCase().includes(search);
        return matchTag && matchSearch;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 bg-white">
            <div className="grid md:grid-cols-[1fr_2fr] gap-10 items-start">
                {/* FORM */}
                <div className="bg-white rounded-xl shadow-md border p-6">
                    <h2 className="text-xl font-bold text-[#0099CF] mb-6 text-center">
                        Đặt câu hỏi
                    </h2>

                    {submitted && (
                        <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">
                            Gửi câu hỏi thành công!
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                        <div>
                            <label className="block mb-1 font-medium">Tên của bạn</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#0099CF]"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#0099CF]"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Chủ đề</label>
                            <select
                                name="tag"
                                value={form.tag}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#0099CF]"
                            >
                                <option value="">-- Lựa chọn chủ đề --</option>
                                {tagOptions.map((tag) => (
                                    <option key={tag.value} value={tag.value}>{tag.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Câu hỏi</label>
                            <textarea
                                name="question"
                                value={form.question}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 h-32 resize-none focus:ring-2 focus:ring-[#0099CF]"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#0099CF] text-white font-semibold py-2 rounded-md hover:bg-[#007ca8]"
                        >
                            Gửi câu hỏi
                        </button>
                    </form>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-[#0099CF] mb-4">Câu hỏi đã được tư vấn</h3>

                    <div className="mb-4 grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Lọc theo chủ đề:</label>
                            <select
                                value={selectedTag}
                                onChange={(e) => setSelectedTag(e.target.value)}
                                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#0099CF]"
                            >
                                <option value="all">-- Tất cả --</option>
                                {tagOptions.map((tag) => (
                                    <option key={tag.value} value={tag.value}>{tag.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Tìm kiếm câu hỏi:</label>
                            <input
                                type="text"
                                placeholder="Từ khóa hoặc tên người hỏi..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#0099CF]"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {filteredAnswered.length > 0 ? (
                            filteredAnswered.map((q, i) => (
                                <div key={i} className="bg-[#f0f8ff] border border-[#0099CF] p-4 rounded-md text-sm">
                                    <p className="text-[#0099CF] font-semibold mb-1">Người dùng {q.customerName}:</p>
                                    <p className="text-gray-800 mb-1">{q.question}</p>
                                    <p className="text-gray-500 italic mb-1">Tư vấn: {q.consultantName}</p>
                                    <p className="text-gray-700">{q.answer}</p>
                                    <p className="text-gray-600 mt-2">Chủ đề: <span className="text-[#0099CF]">{q.tag}</span></p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">Không tìm thấy câu hỏi phù hợp.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
