export const setLocalToken = token => localStorage.setItem(`${import.meta.env.VITE_name_token_user}`, token);
export const getLocalToken = () => localStorage.getItem(`${import.meta.env.VITE_name_token_user}`);
export const removeLocalToken = () => localStorage.removeItem(`${import.meta.env.VITE_name_token_user}`);