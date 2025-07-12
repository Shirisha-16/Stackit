import api from './auth';

export const getQuestions = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/questions?${queryString}`); 
};

export const getQuestion = (id) => api.get(`/questions/${id}`); 
export const createQuestion = (questionData) => api.post('/questions', questionData);
export const updateQuestion = (id, questionData) => api.put(`/questions/${id}`, questionData);
export const deleteQuestion = (id) => api.delete(`/questions/${id}`); 
export const voteQuestion = (id, voteType) => api.post(`/questions/${id}/vote`, { type: voteType }); 
export const searchQuestions = (query, filters = {}) => {
  const params = { q: query, ...filters };
  return getQuestions(params);
};