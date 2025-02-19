const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface LoginCredentials {
  email: string;
  password: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

interface LoginResponse {
  token: string;
  user: {
    userId: number;
    roleId: number;
    name: string;
    email: string;
    phoneNumber: string;
    gender: string;
    profilePicture: string | null;
    currentRole: {
      roleId: number;
      name: string;
      description: string;
    };
    chatUid?: string;
    verificationStatus?: string;
    isEmailVerified?: boolean;
    loginCodeMFA?: string;
  };
}

export const loginUser = async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const loginAdmin = async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const verifyMFA = async (email: string, loginCodeMFA: string): Promise<ApiResponse<LoginResponse>> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      loginCodeMFA: loginCodeMFA.toString().trim()
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const initiatePasswordReset = async (email: string): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/initiate-reset-password`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const refreshToken = async (refreshToken: string): Promise<ApiResponse<{ token: string }>> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}; 
