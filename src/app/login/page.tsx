'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/base/button";
import { Input } from "@/components/ui/Input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Google sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);

    try {
        
        await new Promise(resolve => setTimeout(resolve, 800));
        router.push('/dashboard'); 
    } catch (error) {
        console.error('Login error:', error);
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 lg:p-12">
        {/* Back Button */}
        <button 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 group w-fit"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to dashboard</span>
        </button>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full mt-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500">
              Please enter your details to sign in
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  type="email"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all duration-200"
                />
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-all duration-200 pr-10"
                  />
                  
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 group cursor-pointer">
                <input 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500
                           transition-all duration-200 cursor-pointer"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                  Remember me
                </span>
              </label>
              <button 
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
              >
                Forgot password?
              </button>
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                disabled={!email || !password || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg
                         transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                         transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-lg
                         hover:bg-gray-50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" className="group-hover:scale-110 transition-transform">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <button 
              type="button"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          © {new Date().getFullYear()} Kwik Ride. All Rights Reserved.{' '}
          <span className="text-blue-600">Made with ❤️ by Simmmple!</span>
        </div>
      </div>

      {/*Image */}
      <div className="hidden lg:block w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm" />
        <Image
          src="/images/bg-art.png"
          alt="Authentication background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 max-w-md shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Welcome to Kwik Ride Dashboard
            </h2>
            <p className="text-gray-600">
              Experience seamless authentication and unlock the full potential of our platform.
              Your security is our top priority.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
