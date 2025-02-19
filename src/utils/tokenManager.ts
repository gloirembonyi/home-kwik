import Cookies from 'js-cookie';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const tokenManager = {
  setToken: (token: string, rememberMe: boolean = false) => {
    // Always set in cookie for middleware
    Cookies.set(TOKEN_KEY, token, {
      expires: rememberMe ? 30 : 1, // 30 days if remember me, else 1 day
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    // Set in localStorage/sessionStorage based on rememberMe
    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
  },

  getToken: (): string | null => {
    return (
      Cookies.get(TOKEN_KEY) ||
      localStorage.getItem(TOKEN_KEY) ||
      sessionStorage.getItem(TOKEN_KEY)
    );
  },

  setUser: (user: any, rememberMe: boolean = false) => {
    const userStr = JSON.stringify(user);
    if (rememberMe) {
      localStorage.setItem(USER_KEY, userStr);
    } else {
      sessionStorage.setItem(USER_KEY, userStr);
    }
  },

  getUser: () => {
    const userStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  clearTokens: () => {
    Cookies.remove(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!tokenManager.getToken();
  }
};

export default tokenManager; 