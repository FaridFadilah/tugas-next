// Cookie utility functions
import { User } from '../types';

export const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const isSecure = typeof window !== 'undefined' ? window.location.protocol === 'https:' : false;
  const cookieString = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${isSecure ? '; Secure' : ''}`;
  console.log(`[COOKIES] Setting cookie: ${name} with value: ${value}`);
  console.log(`[COOKIES] Cookie string: ${cookieString}`);
  document.cookie = cookieString;
};

export const getCookie = (name: string): string | null => {
  console.log(`[COOKIES] Getting cookie: ${name}`);
  console.log(`[COOKIES] All cookies: ${document.cookie}`);
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      const value = c.substring(nameEQ.length, c.length);
      // Safely decode URL-encoded cookie values; fall back to raw on failure
      try {
        const decoded = decodeURIComponent(value);
        console.log(`[COOKIES] Found cookie ${name}: ${decoded}`);
        return decoded;
  } catch {
        console.warn(`[COOKIES] Failed to decode cookie ${name}, using raw value`);
        return value;
      }
    }
  }
  console.log(`[COOKIES] Cookie ${name} not found`);
  return null;
};

export const deleteCookie = (name: string) => {
  console.log(`[COOKIES] Deleting cookie: ${name}`);
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
};

export const setAuthCookies = (token: string, user: User) => {
  console.log(`[COOKIES] Setting auth cookies - token: ${token}, user:`, user);
  setCookie('authToken', token, 7); // 7 days
  setCookie('userData', JSON.stringify(user), 7); // 7 days
  
  // Verify cookies were set
  setTimeout(() => {
    const verifyToken = getCookie('authToken');
    const verifyUser = getCookie('userData');
    console.log(`[COOKIES] Verification - authToken: ${verifyToken}`);
    console.log(`[COOKIES] Verification - userData: ${verifyUser}`);
  }, 100);
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
    // userData might be URL-encoded; decode before parsing
    const decoded = (() => {
      try { return decodeURIComponent(userDataStr); } catch { return userDataStr; }
    })();
    const userData = JSON.parse(decoded);
    return { token, user: userData };
  } catch (error) {
    console.error('Error parsing user data from cookie:', error);
    return null;
  }
};
