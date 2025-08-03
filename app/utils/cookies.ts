// Cookie utility functions
export const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Strict; Secure=${window.location.protocol === 'https:'}`;
};

export const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
};

export const setAuthCookies = (token: string, user: any) => {
  setCookie('authToken', token, 7); // 7 days
  setCookie('userData', JSON.stringify(user), 7); // 7 days
};

export const clearAuthCookies = () => {
  deleteCookie('authToken');
  deleteCookie('userData');
};

export const getAuthFromCookies = () => {
  const token = getCookie('authToken');
  const userDataStr = getCookie('userData');
  
  if (!token || !userDataStr) {
    return null;
  }
  
  try {
    const userData = JSON.parse(userDataStr);
    return { token, user: userData };
  } catch (error) {
    console.error('Error parsing user data from cookie:', error);
    return null;
  }
};
