import api from './auth';

export const getAnswers = (questionId) => api.get(`/answers/question/${questionId}`); // Uses backticks
export const createAnswer = (answerData) => api.post('/answers', answerData);
export const updateAnswer = (id, answerData) => api.put(`/answers/${id}`, answerData); // Uses backticks
export const deleteAnswer = (id) => api.delete(`/answers/${id}`); // Uses backticks
export const voteAnswer = (id, voteType) => api.post(`/answers/${id}/vote`, { type: voteType }); // Uses backticks
export const acceptAnswer = (id) => api.post(`/answers/${id}/accept`); // Uses backticks