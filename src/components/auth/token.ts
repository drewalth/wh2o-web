export const getAuthToken = () => localStorage.getItem('wh2o-token');

export const setAuthToken = (token: string) => {
  localStorage.setItem('wh2o-token', token);
  return localStorage.getItem('wh2o-token');
};
