import { useEffect, useState } from "react";
import { Tabs, message } from "antd";
import {
  getUnansweredQuestionsAPI,
  getAnsweredQuestionsAPI,
  answerQuestionAPI,
  getCommentsAPI,
  postCommentAPI,
} from "../../../components/api/Question.api";

export default function ConsultantAnswerPage() {
  const [pending, setPending] = useState([]);
  const [answered, setAnswered] = useState([]);
  const [answers, setAnswers] = useState({});
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});

  useEffect(() => {
    fetchPending();
    fetchAnswered();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await getUnansweredQuestionsAPI();
      const list = Array.isArray(res?.data?.data?.content)
        ? res.data.data.content
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : [];
      setPending(list);
      list.forEach((q) => fetchComments(q.questionId));
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
      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : res;
      setComments((prev) => ({ ...prev, [questionId]: list }));
    } catch (err) {
      console.error("Lỗi khi tải bình luận:", err);
    }
  };

  const handleChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (id) => {
    const answer = answers[id];
    if (!answer || answer.trim() === "") {
      return message.warning("Vui lòng nhập câu trả lời.");
    }

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

  const handleCommentChange = (id, value) => {
    setNewComments((prev) => ({ ...prev, [id]: value }));
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
    console.error("Lỗi khi gửi bình luận:", err.response?.data?.message || err.message);
    message.error("Không thể gửi bình luận: " + (err.response?.data?.message || "Lỗi không xác định"));
  }
};


  const renderComments = (q) => (
    <div className="mt-4">
      <p className="font-medium mb-1 text-[#0099CF]">Bình luận:</p>
      <ul className="text-sm space-y-1 mb-2">
        {(comments[q.questionId] || []).map((c, idx) => (
          <li key={idx} className="text-gray-700 border-l-2 border-[#0099CF] pl-2">
            {c.content}
          </li>
        ))}
      </ul>
      <textarea
        rows={2}
        placeholder="Thêm bình luận..."
        value={newComments[q.questionId] || ""}
        onChange={(e) => handleCommentChange(q.questionId, e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-2 mb-2"
      />
      <div className="text-right">
        <button
          onClick={() => handleCommentSubmit(q.questionId)}
          className="text-sm bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded"
        >
          Gửi bình luận
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-[#0099CF] mb-6">
        Quản lý câu hỏi tư vấn
      </h1>

      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Chưa trả lời" key="1">
          {pending.length === 0 ? (
            <p className="text-gray-500">Không có câu hỏi nào chờ trả lời.</p>
          ) : (
            <div className="space-y-6">
              {pending.map((q) => (
                <div key={q.questionId} className="bg-white border rounded-lg p-6 shadow">
                  <h3 className="text-lg font-semibold mb-2">{q.title}</h3>
                  <p className="text-gray-700 mb-4 whitespace-pre-line">{q.content}</p>

                  <textarea
                    rows={3}
                    value={answers[q.questionId] || ""}
                    onChange={(e) => handleChange(q.questionId, e.target.value)}
                    placeholder="Nhập câu trả lời..."
                    className="w-full border border-gray-300 rounded-lg p-3 mb-3"
                  />

                  <div className="text-right">
                    <button
                      onClick={() => handleSubmit(q.questionId)}
                      className="bg-[#0099CF] text-white px-5 py-2 rounded-lg hover:bg-[#007ca8]"
                    >
                      Gửi trả lời
                    </button>
                  </div>

                  {renderComments(q)}
                </div>
              ))}
            </div>
          )}
        </Tabs.TabPane>

        <Tabs.TabPane tab="Đã trả lời" key="2">
          {answered.length === 0 ? (
            <p className="text-gray-500">Bạn chưa trả lời câu hỏi nào.</p>
          ) : (
            <div className="space-y-6">
              {answered.map((q) => (
                <div key={q.questionId} className="bg-white border rounded-lg p-6 shadow">
                  <h3 className="text-lg font-semibold mb-1">{q.title}</h3>
                  <p className="text-gray-600 mb-2">{q.content}</p>
                  <div className="bg-gray-100 rounded p-4">
                    <p className="font-medium text-[#0099CF] mb-1">Câu trả lời:</p>
                    <p className="text-gray-700 whitespace-pre-line">{q.answer}</p>
                  </div>
                  {renderComments(q)}
                </div>
              ))}
            </div>
          )}
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}
