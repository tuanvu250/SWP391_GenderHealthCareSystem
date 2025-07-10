import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getAnsweredQuestionsAPI,
  createQuestionAPI,
  getCommentsAPI,
  postCommentAPI,
} from "../../components/api/Question.api";
import { message } from "antd";

export default function AskingSection() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({ email: "", question: "", tag: "" });
  const [submitted, setSubmitted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
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
        const matchedTag = tagOptions.find(tag => tag.label.toLowerCase() === titlePrefix);
        return {
          ...q,
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

  useEffect(() => {
    fetchAnswered(0);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: `${form.tag} - ${form.question.slice(0, 60)}`,
      content: form.question,
      consultantId: null,
    };
    try {
      await createQuestionAPI(payload);
      setSubmitted(true);
      setForm({ email: "", question: "", tag: "" });
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
    const matchSearch =
      q.title?.toLowerCase().includes(search) || q.customerFullName?.toLowerCase().includes(search);
    return matchTag && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-white min-h-screen">
      <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">
        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200">
          <div className="p-6 border-b text-center">
            <h2 className="text-2xl font-bold text-[#0099CF]">Gửi câu hỏi mới</h2>
            <p className="text-gray-500 text-sm">Nhận tư vấn riêng tư và bảo mật từ chuyên gia.</p>
          </div>
          <div className="p-6 space-y-4">
            {submitted && (
              <div className="p-3 bg-green-100 text-green-800 rounded-md text-sm border border-green-300">
                ✅ Câu hỏi đã được gửi!
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="fpt@email.com"
                className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
              <select
                name="tag"
                required
                value={form.tag}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-200"
              >
                <option value="">Chọn chủ đề</option>
                {tagOptions.map((tag) => (
                  <option key={tag.value} value={tag.value}>{tag.label}</option>
                ))}
              </select>
              <textarea
                name="question"
                required
                value={form.question}
                onChange={handleChange}
                placeholder="Nhập chi tiết câu hỏi của bạn ở đây..."
                className="w-full px-4 py-2 border rounded-md min-h-[100px] text-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#0099CF] to-[#2F3C7E] hover:brightness-110 text-white font-semibold py-2 px-4 rounded-md transition"
              >
                Gửi đi
              </button>
            </form>
          </div>
        </div>

        {/* DANH SÁCH CÂU HỎI */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800">Câu hỏi thường gặp</h3>
          <p className="text-sm text-gray-600">Tham khảo các câu hỏi đã được chuyên gia của chúng tôi trả lời.</p>

          <div className="flex flex-wrap gap-4">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-3 py-2 border rounded-md shadow-sm text-sm focus:ring focus:ring-blue-200"
            >
              <option value="all">Tất cả chủ đề</option>
              {tagOptions.map((tag) => (
                <option key={tag.value} value={tag.value}>{tag.label}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Tìm kiếm trong các câu hỏi..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="px-3 py-2 border rounded-md flex-1 min-w-[200px] text-sm focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="space-y-4">
            {filteredAnswered.map((q, i) => (
              <div key={i} className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-slate-800 text-sm md:text-base">{q.customerFullName}</p>
                  <span className={`text-xs px-3 py-1 rounded-full ${getTagColor(q.tag)}`}>
                    {getTagLabel(q.tag)}
                  </span>
                </div>
                <div className="text-gray-800 text-sm md:text-base">{q.content}</div>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
                  <p className="text-sm font-semibold text-gray-700">Phản hồi từ chuyên gia:</p>
                  <p className="text-gray-800 text-sm mt-1 whitespace-pre-line">{q.answer}</p>
                </div>
                <CommentBox questionId={q.questionId} />
              </div>
            ))}
            {hasMore && (
              <div className="text-center pt-4">
                <button
                  onClick={() => {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchAnswered(nextPage);
                  }}
                  className="text-[#0099CF] underline text-sm hover:text-[#2F3C7E]"
                >
                  Tải thêm câu hỏi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CommentBox({ questionId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (questionId) fetchComments();
  }, [questionId]);

  const fetchComments = async () => {
    try {
      const res = await getCommentsAPI(questionId);
      setComments(res || []);
    } catch (err) {
      console.error("Lỗi khi tải bình luận:", err);
    }
  };

  const handlePost = async () => {
    if (!newComment.trim()) return;
    try {
      await postCommentAPI(questionId, newComment);
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Gửi bình luận thất bại:", err);
      message.error("Không thể gửi bình luận");
    }
  };

  return (
    <div className="mt-4 border-t pt-4 space-y-3">
      <h4 className="text-sm font-semibold text-gray-700">Thảo luận</h4>
      <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
        {comments.map((c) => (
          <div key={c.commentId} className="flex gap-3 items-start bg-gray-100 p-3 rounded-md">
            {c.userImageUrl ? (
              <img
                src={c.userImageUrl}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300" />
            )}
            <div className="text-sm">
              <div className="font-semibold text-gray-800">{c.userFullName || "Người dùng"}</div>
              <div className="text-gray-700 whitespace-pre-line">{c.content}</div>
              <div className="text-xs text-gray-400 mt-1">{new Date(c.createdAt).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Viết bình luận của bạn..."
          className="flex-1 px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
        />
        <button
          onClick={handlePost}
          className="bg-[#2F3C7E] text-white px-4 py-2 text-sm rounded hover:bg-[#1d285a]"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
