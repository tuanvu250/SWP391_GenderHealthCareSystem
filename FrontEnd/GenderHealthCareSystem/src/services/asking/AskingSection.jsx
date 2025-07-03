"use client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getAnsweredQuestionsAPI,
  createQuestionAPI,
  getMyQuestionsAPI,
} from "../../components/api/Question.api";
import { message } from "antd";

export default function AskingSection() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    email: "",
    question: "",
    tag: "",
  });
  const navigate = useNavigate();


  const [submitted, setSubmitted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [myQuestions, setMyQuestions] = useState([]);
  const [selectedTag, setSelectedTag] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const tagOptions = [
    { label: "Sức Khỏe", value: "suckhoe", color: "bg-green-100 text-green-800" },
    { label: "Giới tính", value: "gioitinh", color: "bg-pink-100 text-pink-800" },
    { label: "Tư vấn", value: "tuvan", color: "bg-blue-100 text-blue-800" },
    { label: "STIs", value: "stis", color: "bg-red-100 text-red-800" },
    { label: "Kinh nguyệt", value: "kinhnguyet", color: "bg-purple-100 text-purple-800" },
  ];

  const fetchAnswered = async (pageIndex = 0) => {
    try {
      const res = await getAnsweredQuestionsAPI(pageIndex, 5);
      const mapped = (Array.isArray(res) ? res : []).map((q) => {
        const titlePrefix = q.title?.split(" - ")[0]?.trim().toLowerCase();
        const matchedTag = tagOptions.find(
          (tag) => tag.label.toLowerCase() === titlePrefix
        );
        return {
          customerName: q.customerFullName || "Ẩn danh",
          consultantName: q.answerByFullName || "Tư vấn viên",
          question: q.title || q.content,
          answer: q.answer,
          tag: matchedTag?.value || "tuvan",
        };
      });

      if (pageIndex === 0) {
        setAnsweredQuestions(mapped);
      } else {
        setAnsweredQuestions((prev) => [...prev, ...mapped]);
      }

      if (mapped.length < 5) setHasMore(false);
    } catch (err) {
      console.error("Lỗi khi tải câu hỏi:", err);
    }
  };

  const fetchMyQuestions = async () => {
    try {
      if (!user?.id) return;
      const res = await getMyQuestionsAPI(user.id);
      setMyQuestions(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Lỗi khi tải câu hỏi của bạn:", err);
      setMyQuestions([]);
    }
  };

  useEffect(() => {
    fetchAnswered(0);
    fetchMyQuestions();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedTagLabel = tagOptions.find((t) => t.value === form.tag)?.label || "Câu hỏi";

    const payload = {
      title: `${selectedTagLabel} - ${form.question.slice(0, 60)}`,
      content: form.question,
      consultantId: null,
    };

    try {
      await createQuestionAPI(payload);
      setSubmitted(true);
      setForm({ email: "", question: "", tag: "" });
      fetchMyQuestions();
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Gửi câu hỏi thất bại:", err);
      message.error("Không thể gửi câu hỏi.");
    }
  };

  const getTagColor = (tagValue) =>
    tagOptions.find((t) => t.value === tagValue)?.color || "bg-gray-100 text-gray-800";
  const getTagLabel = (tagValue) =>
    tagOptions.find((t) => t.value === tagValue)?.label || tagValue;

  const filteredAnswered = answeredQuestions.filter((q) => {
    const matchTag = selectedTag === "all" || q.tag === selectedTag;
    const search = searchText.toLowerCase();
    const matchSearch = q.question.toLowerCase().includes(search) || q.customerName.toLowerCase().includes(search);
    return matchTag && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
      <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">
        {/* FORM */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 sticky top-4">
          <div className="p-6 border-b text-center">
            <h2 className="text-2xl font-bold text-[#0099CF]">Đặt câu hỏi</h2>
            <p className="text-gray-600 text-sm">Gửi câu hỏi của bạn để nhận tư vấn từ chuyên gia</p>
          </div>

          <div className="p-6">
            {submitted && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700">
                ✅ Gửi câu hỏi thành công!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="Email của bạn"
                className="w-full px-3 py-2 border rounded"
              />
              <select
                name="tag"
                required
                value={form.tag}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">-- Chủ đề --</option>
                {tagOptions.map((tag) => (
                  <option key={tag.value} value={tag.value}>{tag.label}</option>
                ))}
              </select>
              <textarea
                name="question"
                required
                value={form.question}
                onChange={handleChange}
                placeholder="Nội dung câu hỏi"
                className="w-full px-3 py-2 border rounded min-h-[100px]"
              />
              <button
                type="submit"
                className="w-full bg-[#0099CF] hover:bg-[#007ca8] text-white font-semibold py-3 px-4 rounded"
              >
                Gửi câu hỏi
              </button>
            </form>
          </div>
        </div>

        {/* DANH SÁCH CÂU HỎI ĐÃ ĐƯỢC TƯ VẤN */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-[#0099CF]">Câu hỏi đã được tư vấn</h3>

          <div className="flex flex-wrap gap-4">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">Tất cả chủ đề</option>
              {tagOptions.map((tag) => (
                <option key={tag.value} value={tag.value}>{tag.label}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="px-3 py-2 border rounded-lg flex-1 min-w-[200px]"
            />
          </div>

          <div className="space-y-4">
            {filteredAnswered.map((q, i) => (
              <div key={i} className="bg-white border rounded-xl p-4 shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-[#0099CF]">{q.customerName}</span>
                  <span className={`text-xs px-3 py-1 rounded-full ${getTagColor(q.tag)}`}>
                    {getTagLabel(q.tag)}
                  </span>
                </div>
                <p className="text-gray-800 font-medium">Câu hỏi: {q.question}</p>
                <p className="text-sm mt-1 text-gray-600"><strong>TVV:</strong> {q.consultantName}</p>
                <p className="mt-1 text-gray-800">{q.answer}</p>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={() => {
                  const nextPage = page + 1;
                  setPage(nextPage);
                  fetchAnswered(nextPage);
                }}
                className="text-[#0099CF] underline text-sm"
              >
                Tải thêm câu hỏi
              </button>
            </div>
          )}

          {/* DANH SÁCH CÂU HỎI CỦA TÔI */}
          <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
              
              <button
                onClick={() => navigate("/my-questions")}
                className="text-sm text-[#0099CF] hover:underline"
              >
                👉 Xem chi tiết tất cả
              </button>
            </div>
            {myQuestions.length === 0 ? (
              <p className="text-gray-500">Bạn chưa gửi câu hỏi nào.</p>
            ) : (
              <div className="space-y-4">
                {myQuestions.map((q, i) => (
                  <div key={i} className="bg-white border rounded-lg p-4 shadow">
                    <p className="font-medium mb-1">🔹 {q.title}</p>
                    <p className="text-sm text-gray-500">
                      Trạng thái:{" "}
                      <span className={q.answer ? "text-green-600" : "text-yellow-600"}>
                        {q.answer ? "Đã được tư vấn" : "Đang chờ tư vấn"}
                      </span>
                    </p>
                   
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
