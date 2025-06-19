import React, { useState } from "react";

export default function AskingSection() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        question: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [myQuestions, setMyQuestions] = useState([]);

    // Câu hỏi đã được trả lời công khai
    const answeredQuestions = [
        {
            customerName: "Mai",
            question: "Em có kinh nguyệt không đều, liệu có ảnh hưởng đến việc mang thai không?",
            consultantName: "Tư vấn viên Minh Trang",
            answer: "Kinh nguyệt không đều có thể ảnh hưởng đến khả năng rụng trứng. Em nên theo dõi thêm và tư vấn kỹ hơn để có kế hoạch phù hợp.",
        },
        {
            customerName: "Tuấn",
            question: "Quan hệ lần đầu có cần dùng bao cao su không nếu bạn gái em đang dùng thuốc tránh thai?",
            consultantName: "Tư vấn viên Quang",
            answer: "Dù dùng thuốc tránh thai, bao cao su vẫn cần thiết để phòng bệnh lây truyền qua đường tình dục.",
        },
        {
            customerName: "Chi",
            question: "Em từng phá thai 1 lần, liệu có ảnh hưởng đến việc mang thai sau này không?",
            consultantName: "Tư vấn viên Thanh Lam",
            answer: "Nếu phá thai đúng cách và được chăm sóc tốt, khả năng sinh sản thường không bị ảnh hưởng.",
        },
    ];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newQuestion = {
            name: form.name,
            email: form.email,
            question: form.question,
            answer: null,
            status: "pending",
        };

        setMyQuestions([...myQuestions, newQuestion]);
        setSubmitted(true);
        setForm({ name: "", email: "", question: "" });


        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="px-4 py-10 bg-white max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">

                <div className="bg-white rounded-xl shadow-lg p-6 border">
                    <h2 className="text-2xl font-bold text-[#0099CF] mb-4 text-center">
                        Gửi câu hỏi sức khỏe giới tính, sinh sản
                    </h2>

                    {submitted && (
                        <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">
                            Gửi câu hỏi thành công!
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Tên của bạn</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border rounded-md focus:ring-[#0099CF] focus:ring-2"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border rounded-md focus:ring-[#0099CF] focus:ring-2"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Câu hỏi</label>
                            <textarea
                                name="question"
                                value={form.question}
                                onChange={handleChange}
                                rows={5}
                                required
                                className="w-full p-3 border rounded-md focus:ring-[#0099CF] focus:ring-2"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#0099CF] hover:bg-[#007ca8] text-white font-semibold py-3 rounded-md transition"
                        >
                            Gửi câu hỏi
                        </button>
                    </form>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-[#0099CF] mb-4">
                        Câu hỏi đã được tư vấn
                    </h3>
                    <div className="space-y-4">
                        {answeredQuestions.map((q, index) => (
                            <div key={index} className="bg-[#f0f8ff] border border-[#0099CF] p-4 rounded-md">
                                <p className="text-[#0099CF] font-semibold mb-1">
                                    Người dùng {q.customerName}:
                                </p>
                                <p className="text-gray-800 mb-2">{q.question}</p>
                                <p className="text-sm text-gray-500 italic">
                                    Tư vấn: {q.consultantName}
                                </p>
                                <p className="text-gray-700 mt-1">{q.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>


            {myQuestions.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-xl font-semibold text-[#0099CF] mb-4">Câu hỏi của bạn</h3>
                    <div className="space-y-4">
                        {myQuestions.map((q, idx) => (
                            <div key={idx} className="border border-gray-300 p-4 rounded-md">
                                <p className="text-gray-800 font-medium">{q.question}</p>
                                <p className="text-sm mt-1">
                                    Trạng thái:{" "}
                                    {q.status === "pending" ? (
                                        <span className="text-yellow-600 font-semibold">⏳ Chờ tư vấn</span>
                                    ) : (
                                        <span className="text-green-600 font-semibold">✅ Đã trả lời</span>
                                    )}
                                </p>
                                {q.answer && (
                                    <p className="text-sm text-gray-600 mt-2">
                                        Trả lời: <span>{q.answer}</span>
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
