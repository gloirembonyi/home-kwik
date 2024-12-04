'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/base/button";
import { useRouter } from "next/navigation";
import { signOut } from 'next-auth/react';

const Logout = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut({ redirect: false });
      router.push('/login'); 
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">You are logged out</h1>
        <p className="text-gray-600 mb-8">
          Thank you for using Kwik Ride. See you again soon!
        </p>
        <Button
          onClick={handleLogout}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-6 rounded-lg
                   transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                   transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging out...
            </div>
          ) : (
            'Log out'
          )}
        </Button>
      </div>
    </div>
  );
};

export default Logout;
