import React, { useEffect, useState } from "react";
import { getMyQuestionsAPI } from "../../components/api/Question.api";

export default function MyQuestionsPage() {
  const [user, setUser] = useState(null);
  const [myQuestions, setMyQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchMyQuestions = async () => {
      if (!user?.userId) return;
      try {
        const res = await getMyQuestionsAPI(user.userId);
        setMyQuestions(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Lỗi khi tải câu hỏi:", err);
        setMyQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyQuestions();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-[#0099CF] mb-6">
        Quản lý câu hỏi của bạn
      </h1>

      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : myQuestions.length === 0 ? (
        <p className="text-gray-500">Bạn chưa gửi câu hỏi nào.</p>
      ) : (
        <div className="space-y-4">
          {myQuestions.map((q, i) => (
            <div key={i} className="bg-white border rounded-lg p-4 shadow">
              <p className="font-medium mb-1">📝 {q.title}</p>
              <p className="text-sm text-gray-500">
                Trạng thái:{" "}
                <span className={q.answer ? "text-green-600" : "text-yellow-600"}>
                  {q.answer ? "Đã được tư vấn" : "Đang chờ tư vấn"}
                </span>
              </p>
              {q.answer && (
                <div className="mt-2 text-sm text-gray-800">
                  <strong>Trả lời:</strong> {q.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
