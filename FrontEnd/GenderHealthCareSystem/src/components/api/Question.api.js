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
  const res = await fetch(`/api/questions/customer/${customerId}`);
  if (!res.ok) throw new Error("Lỗi khi gọi API lấy câu hỏi của bạn");
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

export const getCommentsAPI = async (questionId) => {
  try {
    const res = await apiClient.get(`/questions/${questionId}/comments`);
    return res.data?.data || [];
  } catch (error) {
    console.error("Lỗi khi lấy bình luận:", error);
    throw error;
  }
};
export const postCommentAPI = (questionId, content) => {
  return apiClient.post(`/questions/${questionId}/comments`, {
    questionId, // ✅ phải có nếu DTO yêu cầu
    content,
  });
};
