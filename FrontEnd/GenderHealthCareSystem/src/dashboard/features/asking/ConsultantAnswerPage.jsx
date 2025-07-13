import { useEffect, useState } from "react";
import { message } from "antd";
import {
  getUnansweredQuestionsAPI,
  getAnsweredQuestionsAPI,
  answerQuestionAPI,
  getCommentsAPI,
  postCommentAPI,
} from "../../../components/api/Question.api";

export default function ConsultantAnswerPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [tab, setTab] = useState("pending");
  const [pending, setPending] = useState([]);
  const [answered, setAnswered] = useState([]);
  const [answers, setAnswers] = useState({});
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [selectedTopic, setSelectedTopic] = useState("all");

  const tagOptions = [
    { label: "Sức Khỏe", value: "suckhoe", color: "bg-green-100 text-green-800" },
    { label: "Giới tính", value: "gioitinh", color: "bg-pink-100 text-pink-800" },
    { label: "Tư vấn", value: "tuvan", color: "bg-blue-100 text-blue-800" },
    { label: "STIs", value: "stis", color: "bg-red-100 text-red-800" },
    { label: "Kinh nguyệt", value: "kinhnguyet", color: "bg-purple-100 text-purple-800" },
  ];

  useEffect(() => {
    fetchPending();
    fetchAnswered();
  }, []);

  const mapTag = (q) => {
    const prefix = q.title?.split(" - ")[0]?.trim().toLowerCase();
    const matched = tagOptions.find((t) => t.label.toLowerCase() === prefix);
    return { ...q, tag: matched?.value || "tuvan" };
  };

  const fetchPending = async () => {
    try {
      const res = await getUnansweredQuestionsAPI();
      const list = Array.isArray(res?.data?.data?.content) ? res.data.data.content : [];
      const mapped = list.map(mapTag);
      setPending(mapped);
    } catch (err) {
      console.error("Lỗi khi tải câu hỏi chưa trả lời:", err);
      message.error("Không thể tải danh sách câu hỏi chưa trả lời.");
    }
  };

  const fetchAnswered = async () => {
    try {
      const res = await getAnsweredQuestionsAPI(0, 100);
      const list = Array.isArray(res) ? res : Array.isArray(res?.data?.data?.content) ? res.data.data.content : [];
      const mapped = list.map(mapTag);
      setAnswered(mapped);
      mapped.forEach((q) => fetchComments(q.questionId));
    } catch (err) {
      console.error("Lỗi khi tải câu hỏi đã trả lời:", err);
      message.error("Không thể tải danh sách câu hỏi đã trả lời.");
    }
  };

  const fetchComments = async (questionId) => {
    try {
      const res = await getCommentsAPI(questionId);
      const list = Array.isArray(res?.data?.data) ? res.data.data : [];
      setComments((prev) => ({ ...prev, [questionId]: list }));
    } catch (err) {
      console.error("Lỗi khi tải bình luận:", err);
    }
  };

  const handleSubmit = async (id) => {
    const answer = answers[id];
    if (!answer || answer.trim() === "") return message.warning("Vui lòng nhập câu trả lời.");
    try {
      await answerQuestionAPI(id, answer);
      message.success("Đã trả lời thành công.");
      setAnswers((prev) => ({ ...prev, [id]: "" }));
      fetchPending();
      fetchAnswered();
    } catch (err) {
      console.error("Trả lời thất bại:", err);
      message.error("Không gửi được câu trả lời.");
    }
  };

  const handleCommentSubmit = async (id) => {
    const content = newComments[id];
    if (!content || content.trim() === "") return;
    try {
      await postCommentAPI(id, content);
      const newComment = {
        content: content.trim(),
        userFullName: user?.fullName || "Bạn",
        userImageUrl: user?.imageUrl || null,
        createdAt: new Date().toISOString(),
      };
      setComments((prev) => ({
        ...prev,
        [id]: [...(prev[id] || []), newComment],
      }));
      setNewComments((prev) => ({ ...prev, [id]: "" }));
      message.success("Đã thêm bình luận.");
    } catch (err) {
      console.error("Lỗi khi gửi bình luận:", err);
      message.error("Không thể gửi bình luận.");
    }
  };

  const filterBySelectedTopic = (list) => {
    if (selectedTopic === "all") return list;
    return list.filter((q) => q.tag === selectedTopic);
  };

  const rawTopics = [
    ...pending.map((q) => q.tag),
    ...answered.map((q) => q.tag),
  ];
  const allTopics = Array.from(new Set(rawTopics)).filter((t) => t);

  const getTagColor = (tagValue) =>
    tagOptions.find((t) => t.value === tagValue)?.color || "bg-gray-100 text-gray-800";
  const getTagLabel = (tagValue) =>
    tagOptions.find((t) => t.value === tagValue)?.label || tagValue;

  const renderComments = (q) => (
    <div className="mt-6">
      <h4 className="text-base font-semibold text-slate-800 mb-3">Thảo luận</h4>
      {(comments[q.questionId] || []).length > 0 && (
        <ul className="space-y-3 mb-4">
          {(comments[q.questionId] || []).map((c, idx) => (
            <li key={idx} className="bg-slate-100 px-4 py-3 rounded-lg text-slate-700 text-sm">
              <div className="flex items-center gap-3 mb-1">
                {c.userImageUrl && <img src={c.userImageUrl} className="w-5 h-5 rounded-full" alt="avatar" />}
                <span className="font-medium text-slate-800 text-sm">{c.userFullName || "Ẩn danh"}</span>
              </div>
              <p>{c.content}</p>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-3 items-center">
        <textarea
          rows={1}
          value={newComments[q.questionId] || ""}
          onChange={(e) => setNewComments((prev) => ({ ...prev, [q.questionId]: e.target.value }))}
          className="flex-1 border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#0099CF] focus:border-[#0099CF] resize-none transition"
          placeholder="Viết bình luận..."
        />
        <button
          onClick={() => handleCommentSubmit(q.questionId)}
          className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors shrink-0 text-sm font-medium"
        >
          Gửi
        </button>
      </div>
    </div>
  );

  const renderEmptyState = (messageText) => (
    <div className="text-center py-16 px-6 bg-white rounded-lg border border-dashed border-slate-300">
      <h3 className="text-lg font-medium text-slate-600">{messageText}</h3>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#0099CF]">Câu hỏi từ người dùng</h1>
        </div>

        <div className="flex justify-between mb-4 gap-4 flex-wrap">
          <div className="flex gap-3 border-b border-gray-200">
            <button
              onClick={() => setTab("pending")}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === "pending" ? "border-[#0099CF] text-[#0099CF]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              Chưa trả lời
            </button>
            <button
              onClick={() => setTab("answered")}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === "answered" ? "border-[#0099CF] text-[#0099CF]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              Đã trả lời
            </button>
          </div>

          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-3 py-2 border rounded-md shadow-sm text-sm"
          >
            <option value="all">Tất cả chủ đề</option>
            {allTopics.map((topic) => (
              <option key={topic} value={topic}>{getTagLabel(topic)}</option>
            ))}
          </select>
        </div>

        {tab === "pending" && (
          filterBySelectedTopic(pending).length === 0 ? (
            renderEmptyState("Không có câu hỏi nào đang chờ trả lời.")
          ) : (
            <div className="space-y-6">
              {filterBySelectedTopic(pending).map((q) => (
                <div key={q.questionId} className="bg-white p-5 rounded-xl shadow border border-gray-200">
                  <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      {q.customerImageUrl && (
                        <img src={q.customerImageUrl} className="w-6 h-6 rounded-full" alt="avatar" />
                      )}
                      <span className="font-medium text-gray-800">{q.customerFullName || "Ẩn danh"}</span>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${getTagColor(q.tag)}`}>
                      {getTagLabel(q.tag)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#0099CF] mb-2">{q.title}</h3>
                  <p className="text-gray-700 mb-4">{q.content}</p>
                  <textarea
                    rows={4}
                    value={answers[q.questionId] || ""}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [q.questionId]: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring focus:ring-[#0099CF]"
                    placeholder="Nhập câu trả lời tại đây..."
                  ></textarea>
                  <div className="text-right mt-3">
                    <button
                      onClick={() => handleSubmit(q.questionId)}
                      className="bg-[#0099CF] text-white px-5 py-2 rounded hover:bg-[#007ca8]"
                    >
                      Gửi trả lời
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {tab === "answered" && (
          filterBySelectedTopic(answered).length === 0 ? (
            renderEmptyState("Bạn chưa trả lời câu hỏi nào.")
          ) : (
            <div className="space-y-6">
              {filterBySelectedTopic(answered).map((q) => (
                <div key={q.questionId} className="bg-white p-5 rounded-xl shadow border border-gray-200">
                  <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      {q.customerImageUrl && (
                        <img src={q.customerImageUrl} className="w-6 h-6 rounded-full" alt="avatar" />
                      )}
                      <span className="font-medium text-gray-800">{q.customerFullName || "Ẩn danh"}</span>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${getTagColor(q.tag)}`}>
                      {getTagLabel(q.tag)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#0099CF] mb-2">{q.title}</h3>
                  <p className="text-gray-700 mb-4">{q.content}</p>
                  <div className="bg-blue-50 border-l-4 border-[#0099CF] p-4 rounded">
                    <p className="text-sm font-medium text-[#007ca8] mb-1">Câu trả lời:</p>
                    <p className="text-gray-800 text-sm leading-relaxed">{q.answer}</p>
                  </div>
                  {renderComments(q)}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
