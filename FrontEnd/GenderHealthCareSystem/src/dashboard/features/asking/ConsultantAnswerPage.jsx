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
  const [tab, setTab] = useState("pending");
  const [pending, setPending] = useState([]);
  const [answered, setAnswered] = useState([]);
  const [answers, setAnswers] = useState({});
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [selectedTopic, setSelectedTopic] = useState("all");

  useEffect(() => {
    fetchPending();
    fetchAnswered();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await getUnansweredQuestionsAPI();
      const list = Array.isArray(res?.data?.data?.content) ? res.data.data.content : [];
      setPending(list);
    } catch (err) {
      console.error("Lỗi khi tải câu hỏi chưa trả lời:", err);
      message.error("Không thể tải danh sách câu hỏi chưa trả lời.");
    }
  };

  const fetchAnswered = async () => {
    try {
      const res = await getAnsweredQuestionsAPI(0, 100);
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data?.data?.content)
        ? res.data.data.content
        : [];
      setAnswered(list);
      list.forEach((q) => fetchComments(q.questionId));
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
      message.success("Đã thêm bình luận.");
      setNewComments((prev) => ({ ...prev, [id]: "" }));
      fetchComments(id);
    } catch (err) {
      console.error("Lỗi khi gửi bình luận:", err);
      message.error("Không thể gửi bình luận.");
    }
  };

  // Group theo chủ đề (lowercase để tránh trùng)
  const groupByTopic = (list) => {
    return list.reduce((acc, q) => {
      const rawTitle = q.title || "";
      const topic = rawTitle.split(" - ")[0].trim().toLowerCase() || "khác";
      if (!acc[topic]) acc[topic] = [];
      acc[topic].push(q);
      return acc;
    }, {});
  };

  // Lọc theo selectedTopic
  const filterBySelectedTopic = (list) => {
    if (selectedTopic === "all") return list;
    return list.filter((q) => (q.title || "").toLowerCase().startsWith(selectedTopic + " -"));
  };

  // Tạo allTopics: lowercase, bỏ trùng
  const rawTopics = [
    ...pending.map((q) => (q.title || "").split(" - ")[0].trim().toLowerCase()),
    ...answered.map((q) => (q.title || "").split(" - ")[0].trim().toLowerCase()),
  ];
  const allTopics = Array.from(new Set(rawTopics)).filter((t) => t);

  // Capitalize để hiển thị đẹp
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const renderComments = (q) => (
    <div className="mt-4">
      <p className="font-semibold text-[#0099CF] mb-2">Bình luận</p>
      <ul className="space-y-2 mb-2">
        {(comments[q.questionId] || []).map((c, idx) => (
          <li key={idx} className="bg-gray-100 px-3 py-2 rounded">{c.content}</li>
        ))}
      </ul>
      <div className="flex gap-2">
        <textarea
          rows={2}
          value={newComments[q.questionId] || ""}
          onChange={(e) => setNewComments((prev) => ({ ...prev, [q.questionId]: e.target.value }))}
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#0099CF] resize-none"
          placeholder="Thêm bình luận..."
        />
        <button
          onClick={() => handleCommentSubmit(q.questionId)}
          className="bg-[#0099CF] text-white px-4 py-1.5 rounded-lg hover:bg-[#007ca8] transition-colors"
        >
          Gửi
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-[#0099CF] mb-8">
        Quản lý câu hỏi tư vấn
      </h1>

      {/* Tabs */}
      <div className="flex justify-center mb-6 gap-2">
        <button
          onClick={() => setTab("pending")}
          className={`px-5 py-2 rounded font-medium ${tab === "pending" ? "bg-[#0099CF] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
        >
          Chưa trả lời ({pending.length})
        </button>
        <button
          onClick={() => setTab("answered")}
          className={`px-5 py-2 rounded font-medium ${tab === "answered" ? "bg-[#0099CF] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
        >
          Đã trả lời ({answered.length})
        </button>
      </div>

      {/* Dropdown lọc chủ đề */}
      <div className="flex justify-end mb-4">
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="all">Tất cả chủ đề</option>
          {allTopics.map((topic) => (
            <option key={topic} value={topic}>{capitalize(topic)}</option>
          ))}
        </select>
      </div>

      {/* Pending questions */}
      {tab === "pending" && (
        filterBySelectedTopic(pending).length === 0 ? (
          <p className="text-center text-gray-500">Không có câu hỏi nào chờ trả lời.</p>
        ) : (
          Object.entries(groupByTopic(filterBySelectedTopic(pending))).map(([topic, questions]) => (
            <div key={topic} className="mb-6">
              <h2 className="text-xl font-semibold text-[#0099CF] mb-4">{capitalize(topic)} ({questions.length})</h2>
              <div className="space-y-4">
                {questions.map((q) => (
                  <div key={q.questionId} className="bg-white border rounded-xl shadow-sm p-5 hover:shadow-md transition">
                    <h3 className="font-semibold text-lg mb-2">{q.title}</h3>
                    <p className="text-gray-700 mb-4 whitespace-pre-line">{q.content}</p>
                    <textarea
                      rows={3}
                      value={answers[q.questionId] || ""}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, [q.questionId]: e.target.value }))}
                      placeholder="Nhập câu trả lời..."
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#0099CF] resize-none mb-3"
                    />
                    <div className="text-right">
                      <button
                        onClick={() => handleSubmit(q.questionId)}
                        className="bg-[#0099CF] text-white px-4 py-2 rounded-lg hover:bg-[#007ca8] transition-colors"
                      >
                        Gửi trả lời
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )
      )}

      {/* Answered questions */}
      {tab === "answered" && (
        filterBySelectedTopic(answered).length === 0 ? (
          <p className="text-center text-gray-500">Bạn chưa trả lời câu hỏi nào.</p>
        ) : (
          Object.entries(groupByTopic(filterBySelectedTopic(answered))).map(([topic, questions]) => (
            <div key={topic} className="mb-6">
              <h2 className="text-xl font-semibold text-[#0099CF] mb-4">{capitalize(topic)} ({questions.length})</h2>
              <div className="space-y-4">
                {questions.map((q) => (
                  <div key={q.questionId} className="bg-white border rounded-xl shadow-sm p-5 hover:shadow-md transition">
                    <h3 className="font-semibold text-lg mb-2">{q.title}</h3>
                    <p className="text-gray-700 mb-3 whitespace-pre-line">{q.content}</p>
                    <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-3">
                      <p className="font-medium text-[#0099CF] mb-1">Câu trả lời:</p>
                      <p className="text-gray-800 whitespace-pre-line">{q.answer}</p>
                    </div>
                    {renderComments(q)}
                  </div>
                ))}
              </div>
            </div>
          ))
        )
      )}
    </div>
  );
}
