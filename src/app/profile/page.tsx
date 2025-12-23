"use client";

import { useRouter } from "next/navigation";
import React from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = React.useState("Nothing");

  const handleLogout = async () => {
    // Clear user session or token here if needed
    // For example: localStorage.removeItem("token");

    try {
      await axios.get("/api/users/logout");

      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error: any) {
      console.log(error.response?.data?.message || error.message);

      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };


  const getUser = async () => {
    console.log("Getting user info...");
    
    const res = await axios.get("/api/users/useractive");
    console.log(res.data);

    setData(res.data.data._id);

  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-black transition-colors duration-300 px-4 md:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-stone-100/80 dark:bg-gray-900/80 backdrop-blur-md p-6 md:p-8 lg:p-10 rounded-2xl shadow-2xl border border-stone-300/50 dark:border-gray-800/50">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 dark:text-white mb-4 md:mb-6 text-center leading-tight">
            Profile Dashboard
          </h1>
          <p className="text-base md:text-lg text-stone-600 dark:text-gray-300 text-center mb-8 md:mb-12 leading-relaxed">
            Manage your account and settings
          </p>
          
          <div className="space-y-6 md:space-y-8">
            <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl border border-stone-200 dark:border-gray-700">
              <h2 className="text-lg md:text-xl font-semibold text-stone-900 dark:text-white mb-3 md:mb-4">
                User Information
              </h2>
              <div className="p-4 md:p-6 bg-orange-100 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <span className="text-sm md:text-base text-stone-700 dark:text-gray-300">
                  User ID: {data === 'nothing' ? 'Not loaded' : data}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <button
                onClick={getUser}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
              >
                Get User Info
              </button>
              
              <Link
                href="/ai_chat"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 text-sm md:text-base text-center inline-block"
              >
                AI Chatbot
              </Link>
              
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
