import apiClient from "./apiClient";

export const getAnsweredQuestionsAPI = async (page = 0, size = 5) => {
  const res = await apiClient.get("/questions/answered", {
    params: { page, size },
  });
  return res.data?.data?.content || [];
};

export const createQuestionAPI = async ({ title, content, consultantId }) => {
  return apiClient.post("/questions", { title, content, consultantId });
};

// components/api/Question.api.js
export const getMyQuestionsAPI = async (customerId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`/api/questions/customer/${customerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // thêm token nếu có
    },
  });

  if (!res.ok) {
    console.error("Lỗi khi gọi API lấy câu hỏi:", res.status, await res.text());
    throw new Error("Lỗi khi gọi API lấy câu hỏi của bạn");
  }

  return res.json();
};

 
export const getUnansweredQuestionsAPI = async () => {
  return apiClient.get("/questions/pending");
};

export const answerQuestionAPI = async (questionId, answer) => {
  return apiClient.post(`/questions/${questionId}/answer`, { answer });
};

export const getAllQuestionsAPI = async () => {
  return apiClient.get("/questions"); 
};

export const getQuestionCommentsAPI = async (questionId) => {
  const res = await apiClient.get(`/questions/${questionId}/comments`);
  return res.data?.data || [];
};

export const postQuestionCommentAPI = async (questionId, content) => {
  return apiClient.post(`/questions/${questionId}/comments`, { content });
};