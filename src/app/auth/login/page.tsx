"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/base/button";
import { Input } from "@/components/ui/Input";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import {
  loginAdmin,
  loginUser,
  initiatePasswordReset,
  verifyMFA,
} from "@/utils/api";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/base/tabs";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/hooks/useAuth";
import type {
  ApiResponse,
  LoginResponse,
  MFAResponse,
  AdminLoginResponse,
} from "@/types/types";
import type { User } from "@/components/hooks/useAuth";

interface VerificationInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  onComplete?: (value: string) => void;
}

const VerificationInput: React.FC<VerificationInputProps> = ({
  value,
  onChange,
  length = 6,
  onComplete,
}) => {
  const inputRefs = Array(length)
    .fill(0)
    .map(() => React.useRef<HTMLInputElement>(null));

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      inputRefs[idx - 1].current?.focus();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const newValue = e.target.value.slice(-1);
    const newCode = value.split("");
    newCode[idx] = newValue;
    const combinedValue = newCode.join("");
    onChange(combinedValue);

    if (newValue && idx < length - 1) {
      inputRefs[idx + 1].current?.focus();
    }

    if (combinedValue.length === length) {
      onComplete?.(combinedValue);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    const numericData = pastedData.replace(/[^0-9]/g, "").slice(0, length);
    if (numericData.length > 0) {
      onChange(numericData);
      if (numericData.length === length) {
        inputRefs[length - 1].current?.focus();
        onComplete?.(numericData);
      } else {
        inputRefs[numericData.length].current?.focus();
      }
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array(length)
        .fill(0)
        .map((_, idx) => (
          <input
            key={idx}
            ref={inputRefs[idx]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[idx] || ""}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onPaste={handlePaste}
            className="w-12 h-12 text-center text-lg font-semibold rounded-lg 
                   border-2 border-input bg-background
                   focus:border-primary focus:ring-2 focus:ring-primary/20
                   transition-all duration-200
                   dark:border-input/20 dark:focus:border-primary/80"
          />
        ))}
    </div>
  );
};

interface ApiLoginResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    user: User;
  };
}

interface ApiMFAResponse {
  success: boolean;
  message?: string;
  data: {
    loginCodeMFA: string;
  };
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginCodeMFA, setLoginCodeMFA] = useState("");
  const [showMFAInput, setShowMFAInput] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const validateForm = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleEmailLogin = async (e: React.FormEvent, isAdmin = false) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const loginFn = isAdmin ? loginAdmin : loginUser;
      const response = await loginFn({ email, password });
      console.log("Login response:", response); // For debugging

      if (response.success) {
        if (isAdmin) {
          if (response.data.token) {
            await login(response.data.token, response.data.user, rememberMe);
            setSuccess("Login successful! Redirecting to dashboard...");
            router.push("/dashboard");
          } else {
            setError("Invalid admin credentials");
          }
        } else {
          // For regular users, check if we need to verify MFA
          if (response.message === "Go to verify Login") {
            setShowMFAInput(true);
            setSuccess("Please enter the verification code sent to your email");
          } else if (response.data.token) {
            // Direct login without MFA
            await login(response.data.token, response.data.user, rememberMe);
            setSuccess("Login successful!");
            router.push("/dashboard");
          } else {
            setError("Invalid response from server");
          }
        }
      } else {
        setError(response.message || "Invalid credentials. Please try again.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response?.status === 429) {
        setError("Too many login attempts. Please try again later.");
      } else if (error.response?.status === 401) {
        setError("Invalid email or password. Please check your credentials.");
      } else if (error.response?.status === 403) {
        setError("Your account has been locked. Please contact support.");
      } else if (!navigator.onLine) {
        setError("No internet connection. Please check your network.");
      } else {
        setError(
          error.message ||
            error.response?.data?.message ||
            "An error occurred during login. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMFAVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginCodeMFA || loginCodeMFA.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await verifyMFA(email, loginCodeMFA.trim());
      console.log("MFA verification response:", response); // Debug log

      if (response.success && response.data.token) {
        // First set success message
        setSuccess("Login successful!");

        // Store the token and user data
        await login(response.data.token, response.data.user, rememberMe);

        // Immediate redirect
        router.replace("/dashboard");
      } else {
        setError(response.message || "Invalid verification code");
      }
    } catch (error: any) {
      console.error("MFA verification error:", error);
      if (error.response?.status === 410) {
        setError("Verification code has expired. Please request a new one.");
      } else if (error.response?.status === 429) {
        setError("Too many attempts. Please try again later.");
      } else if (!navigator.onLine) {
        setError("No internet connection. Please check your network.");
      } else {
        setError(
          error.message ||
            error.response?.data?.message ||
            "Failed to verify code. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }
    setLoading(true);
    try {
      const response = await initiatePasswordReset(email);
      if (response.success) {
        setSuccess("Password reset instructions sent to your email");
      } else {
        setError(response.message || "Failed to initiate password reset");
      }
    } catch (error) {
      setError("An error occurred while requesting password reset");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);

      if (credential?.accessToken && result.user) {
        const userData: User = {
          userId: parseInt(result.user.uid) || 0,
          roleId: 2,
          name: result.user.displayName || "",
          email: result.user.email || "",
          phoneNumber: result.user.phoneNumber || "",
          gender: "",
          profilePicture: result.user.photoURL,
          currentRole: {
            roleId: 2,
            name: "PASSENGER",
            description: "passenger role",
          },
          chatUid: result.user.uid,
          verificationStatus: "VERIFIED",
          isEmailVerified: result.user.emailVerified,
        };

        await login(credential.accessToken, userData, rememberMe);
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      setError(error.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendDisabled) return;

    setResendDisabled(true);
    setResendTimer(30);

    try {
      const response = (await loginUser({
        email,
        password,
      })) as unknown as ApiMFAResponse;

      if (response.success) {
        setSuccess("New verification code sent to your email");
      } else {
        setError(response.message || "Failed to resend code");
      }
    } catch (error: any) {
      setError("Failed to resend verification code");
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerificationComplete = async (code: string) => {
    if (code.length === 6) {
      setLoginCodeMFA(code);
      const event = new Event("submit") as any;
      await handleMFAVerification(event);
    }
  };

  const renderLoginForm = (isAdmin = false) => (
    <form onSubmit={(e) => handleEmailLogin(e, isAdmin)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor={isAdmin ? "admin-email" : "email"}
            className="block text-sm font-medium text-foreground/80 mb-1"
          >
            Email
          </label>
          <Input
            id={isAdmin ? "admin-email" : "email"}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-0 py-0 rounded-lg border border-input bg-background
                     focus:ring-2 focus:ring-primary/20 focus:border-primary
                     transition-all duration-200"
          />
        </div>

        <div className="relative">
          <label
            htmlFor={isAdmin ? "admin-password" : "password"}
            className="block text-sm font-medium text-foreground/80 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <Input
              id={isAdmin ? "admin-password" : "password"}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-0 py-0 rounded-lg border border-input bg-background
                       focus:ring-2 focus:ring-primary/20 focus:border-primary
                       transition-all duration-200 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground 
                       hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 group cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded border-input text-primary focus:ring-primary/20
                     transition-all duration-200 cursor-pointer
                     dark:border-input/20 dark:focus:ring-primary/40"
          />
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            Remember me
          </span>
        </label>
        <button
          type="button"
          onClick={handlePasswordReset}
          className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        disabled={!email || !password || loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg
                 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {isAdmin ? "Signing in as admin..." : "Signing in..."}
          </div>
        ) : isAdmin ? (
          "Sign in as Admin"
        ) : (
          "Sign in"
        )}
      </Button>

      {!isAdmin && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-input"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                or
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full"
          >
            Continue with Google
          </Button>
        </>
      )}
    </form>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      <div className="w-full lg:w-1/2 flex flex-col p-6 lg:p-12">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground group w-fit"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to home</span>
        </button>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full mt-8">
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground">
              {showMFAInput
                ? "Enter verification code"
                : "Please enter your details to sign in"}
            </p>
          </div>

          {showMFAInput ? (
            <form onSubmit={handleMFAVerification} className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                  Two-Factor Authentication
                </h2>
                <p className="text-muted-foreground">
                  Enter the verification code sent to
                  <span className="block font-medium text-foreground mt-1">
                    {email}
                  </span>
                </p>
              </div>

              <div className="space-y-6">
                <VerificationInput
                  value={loginCodeMFA}
                  onChange={setLoginCodeMFA}
                  length={6}
                  onComplete={handleVerificationComplete}
                />

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the code?
                  </p>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendDisabled}
                    className="text-primary hover:text-primary/80 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendDisabled
                      ? `Resend code in ${resendTimer}s`
                      : "Resend code"}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loginCodeMFA.length !== 6 || loading}
                className="w-full"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </Button>

              {(error || success) && (
                <div
                  className={cn(
                    "mt-4 p-3 rounded-lg text-sm",
                    error
                      ? "bg-destructive/10 text-destructive dark:bg-destructive/20"
                      : "bg-success/10 text-success dark:bg-success/20"
                  )}
                >
                  {error || success}
                </div>
              )}
            </form>
          ) : (
            <>
              <Tabs defaultValue="user" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="user">User</TabsTrigger>
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>

                <TabsContent value="user" className="space-y-6">
                  {renderLoginForm(false)}
                </TabsContent>

                <TabsContent value="admin" className="space-y-6">
                  {renderLoginForm(true)}
                </TabsContent>
              </Tabs>

              {(error || success) && (
                <div
                  className={cn(
                    "mt-4 p-3 rounded-lg text-sm",
                    error
                      ? "bg-destructive/10 text-destructive dark:bg-destructive/20"
                      : "bg-success/10 text-success dark:bg-success/20"
                  )}
                >
                  {error || success}
                </div>
              )}

              <p className="text-center text-sm text-muted-foreground mt-6">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/signup")}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign up
                </button>
              </p>
            </>
          )}
        </div>
      </div>

      <div className="hidden lg:block w-1/2 relative bg-gradient-to-br from-primary/5 to-primary/10">
        <Image
          src="/images/bg-art.png"
          alt="Login background"
          fill
          className="object-cover object-center opacity-90"
          priority
          quality={100}
        />
        <div className="relative z-10 h-full flex items-center justify-center p-12">
          <div className="bg-background/95 backdrop-blur-sm rounded-lg p-8 max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              Welcome to Kwik Ride Dashboard
            </h2>
            <p className="text-muted-foreground">
              Manage your ride-sharing platform efficiently with our
              comprehensive dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
