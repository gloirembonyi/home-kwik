'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/base/button";
import { Input } from "@/components/ui/Input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 800));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center p-4">
      {/* Left side - Background Art */}
      <div className="hidden lg:flex items-center justify-center flex-1 lg:basis-1/2 2xl:basis-2/3 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/10 rounded-3xl" />
        <Image
          src="/images/bg-art.png"
          alt="Background Art"
          height={1000}
          width={1000}
          className="object-cover rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-all duration-700"
          priority
        />
      </div>

      {/* Right side - Login Form */}
      <div className="bg-white/90 backdrop-blur-md flex-1 sm:basis-1/2 2xl:basis-1/3 min-h-[90vh] 
                    rounded-3xl shadow-xl flex flex-col gap-6 py-10 px-8 md:px-12 
                    transform hover:shadow-2xl transition-all duration-300">
        
        {/* Logo Section */}
        <div className="text-center space-y-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur opacity-0 
                          group-hover:opacity-20 transition-all duration-500" />
            <Image
              src="/images/logo.png"
              alt="Logo"
              height={250}
              width={250}
              className="mx-auto relative transform hover:scale-105 transition-all duration-300"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent
                       mt-6 animate-fade-in">
            Welcome Back!
          </h1>
          <p className="text-gray-600">
            Please enter your details to continue
          </p>
        </div>

        {/* Form Section */}
        <div className="space-y-6 w-full max-w-sm mx-auto mt-4">
          {/* Email Input */}
          <div className="relative group">
            <Mail className="absolute left-0.50 right-2 top-1/2 transform -translate-y-1/2 text-gray-400
                         group-hover:text-gray-600 transition-colors duration-200" 
                size={20} />
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              type="email"
              className="pl-10 pr-16 py-3 rounded-xl border-gray-200 w-full
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       hover:border-gray-300 transition-all duration-200"
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <Lock className="absolute left-0.50 pr-16 top-1/2 transform -translate-y-1/2 text-gray-400 
                         group-hover:text-gray-600 transition-colors duration-200" 
                size={20} />
            <Input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              className="pl-10 pr-12 py- rounded-xl border-gray-200 w-full
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       hover:border-gray-300 transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 
                       hover:text-gray-600 transition-colors duration-200"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Additional Options */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input 
                type="checkbox" 
                className="rounded text-blue-600 focus:ring-blue-500 border-gray-300
                         transition-all duration-200"
              />
              <span className="text-gray-600 group-hover:text-gray-800">Remember me</span>
            </label>
            <button className="text-gray-600 hover:text-gray-800 hover:underline">
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={!email || !password || loading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl py-3
                     flex items-center justify-center gap-2
                     transform hover:scale-[1.02] transition-all duration-200
                     shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </Button>

          {/* Sign Up Link */}
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button className="text-gray-900 hover:text-gray-700 font-medium hover:underline">
                Create Account
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-xs mt-auto">
          Protected by reCAPTCHA and subject to the{' '}
          <button className="text-gray-700 hover:text-gray-900 hover:underline">Privacy Policy</button>{' '}
          and{' '}
          <button className="text-gray-700 hover:text-gray-900 hover:underline">Terms of Service</button>
        </div>
      </div>
    </div>
  );
};

export default Login;