'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/base/button";
import { Input } from "@/components/ui/Input";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center p-4">
      {/* Left side - Background Art */}
      <div className="hidden lg:flex items-center justify-center flex-1 lg:basis-1/2 2xl:basis-2/3">
        <div className="relative w-full h-[90vh] rounded-3xl overflow-hidden">
          <Image
            src="/images/bg-art.png"
            alt="Background Art"
            fill
            className="object-cover rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-all duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/20 rounded-3xl" />
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="bg-white/95 backdrop-blur-lg flex-1 sm:basis-1/2 2xl:basis-1/3 min-h-[90vh] 
                    rounded-3xl shadow-xl flex flex-col gap-8 py-12 px-8 md:px-16 
                    transform hover:shadow-2xl transition-all duration-300">
        
        {/* Logo Section */}
        <div className="text-center space-y-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full blur opacity-0 
                          group-hover:opacity-20 transition-all duration-500" />
            <Image
              src="/images/logo.png"
              alt="Logo"
              height={200}
              width={200}
              className="mx-auto relative transform hover:scale-105 transition-all duration-300"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-lg">
              Sign in to continue to your account
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="space-y-8 w-full max-w-sm mx-auto">
          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
              className="w-full px-4 py-3 rounded-xl border-gray-200
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       hover:border-gray-300 transition-all duration-200"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              type="password"
              className="w-full px-4 py-3 rounded-xl border-gray-200
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       hover:border-gray-300 transition-all duration-200"
            />
          </div>

          {/* Additional Options */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded text-blue-600 focus:ring-blue-500 border-gray-300
                         transition-all duration-200"
              />
              <span className="text-gray-600 hover:text-gray-800">Remember me</span>
            </label>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={!email || !password || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3
                     transform hover:scale-[1.02] transition-all duration-200
                     shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Create Account
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-auto">
          Protected by reCAPTCHA and subject to the{' '}
          <button className="text-gray-700 hover:text-gray-900">Privacy Policy</button>{' '}
          and{' '}
          <button className="text-gray-700 hover:text-gray-900">Terms of Service</button>
        </div>
      </div>
    </div>
  );
};

export default Login;