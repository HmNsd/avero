"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    password: "",
    email: "",
  });

  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [buttonDisabled, setButtonDisabled] = React.useState(false);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      if (!user.email.trim || !user.password.trim()) {
        setError("All fields are required.");
        setButtonDisabled(true);
        return;
      }
      const response = await axios.post("/api/users/login", user);
      console.log("Login Success", response.data);
      router.push("/profile");

      // // Simulate Login logic (you can connect to your API here)
      // setTimeout(() => {
      //   setSuccess(true);
      // }, 1000);
    } catch (error: any) {
      setError("An error occurred during login. Please try again.");
      setSuccess(false);
      console.log(error);
    }
  };

  // Add this useEffect to handle button disabled state
  useEffect(() => {
    if (!user.email.trim() || !user.password.trim()) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-black flex items-center justify-center transition-colors duration-300 px-4 md:px-6 lg:px-8 py-8 md:py-12">
      <div className="w-full max-w-lg bg-stone-100/80 dark:bg-gray-900/80 backdrop-blur-md p-6 md:p-8 lg:p-10 rounded-2xl shadow-2xl border border-stone-300/50 dark:border-gray-800/50">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-stone-900 dark:text-white mb-6 md:mb-8 text-center leading-tight">
          Welcome Back
        </h2>
        <p className="text-sm md:text-base text-stone-600 dark:text-gray-300 text-center mb-6 md:mb-8 leading-relaxed">
          Sign in to your account to continue
        </p>

        <form onSubmit={onLogin} className="space-y-4 md:space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm md:text-base font-semibold text-stone-700 dark:text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full px-4 md:px-5 py-3 md:py-4 bg-white dark:bg-gray-800 text-stone-900 dark:text-white border border-stone-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm md:text-base"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm md:text-base font-semibold text-stone-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full px-4 md:px-5 py-3 md:py-4 bg-white dark:bg-gray-800 text-stone-900 dark:text-white border border-stone-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm md:text-base"
              placeholder="Enter your password"
            />
          </div>

          {/* Error or Success Message */}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && (
            <p className="text-sm text-green-500">Signup successful!</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 md:py-4 px-6 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 transform hover:scale-105 ${
              buttonDisabled
                ? "bg-gray-400 cursor-not-allowed text-gray-600"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl"
            }`}
            disabled={buttonDisabled}
          >
            Sign In
          </button>
        </form>

        {/* Redirect Links */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 md:mt-8 gap-3 md:gap-4">
          <p className="text-sm md:text-base text-stone-700 dark:text-gray-300 text-center sm:text-left">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold transition-colors"
            >
              Sign Up
            </Link>
          </p>
          <Link
            href="/forgotpassword"
            className="text-sm md:text-base text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
