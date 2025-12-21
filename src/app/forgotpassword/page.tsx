"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // New state for reset password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  // Get token from URL
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const forgotUserEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSuccess(false);

    if (!email.trim()) {
      setError("Email is required.");
      setButtonDisabled(true);
      return;
    }

    try {
      // Replace with your API endpoint for sending reset email
      await axios.post("/api/users/forgotpassword", { email });
      setMessage("Reset link has been sent.");
      setSuccess(true);
    } catch (err: any) {
      setError("Failed to send reset link. Please try again.");
    }
  };

  // Handle new password submission
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("Both fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Invalid or missing token.");
      return;
    }

    try {
      await axios.patch("/api/users/forgotpassword", {
        token,
        newPassword,
      });
      setResetSuccess(true);
      setMessage("Password has been reset successfully. You can now log in.");
    } catch (err: any) {
      setError("Failed to reset password. The link may be invalid or expired.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-black flex items-center justify-center transition-colors duration-300 px-4 md:px-6 lg:px-8 py-8 md:py-12">
      <div className="w-full max-w-lg bg-stone-100/80 dark:bg-gray-900/80 backdrop-blur-md p-6 md:p-8 lg:p-10 rounded-2xl shadow-2xl border border-stone-300/50 dark:border-gray-800/50">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-stone-900 dark:text-white mb-6 md:mb-8 text-center leading-tight">
          Reset Password
        </h2>
        {/* If token is present in URL, show reset password form */}
        {token ? (
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-stone-900 dark:text-white text-center mb-4 md:mb-6 leading-tight">
              Set New Password
            </h1>
            <p className="text-sm md:text-base text-stone-600 dark:text-gray-300 text-center mb-6 md:mb-8 leading-relaxed">
              Enter your new password below
            </p>
            {resetSuccess ? (
              <div>
                <p className="text-green-500 text-center mb-4">{message}</p>
                <Link href="/login">
                  <button className="w-full font-semibold py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200">
                    Go to Login
                  </button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-stone-700 dark:text-gray-300"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 w-full px-4 py-2 bg-white dark:bg-gray-800 text-stone-900 dark:text-white border border-stone-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-stone-700 dark:text-gray-300"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 w-full px-4 py-2 bg-white dark:bg-gray-800 text-stone-900 dark:text-white border border-stone-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Confirm new password"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {message && <p className="text-green-500 text-sm">{message}</p>}
                <button
                  type="submit"
                  className="w-full font-semibold py-2 px-4 rounded-md bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
                >
                  Save New Password
                </button>
              </form>
            )}
          </div>
        ) : (
          // Default: forgot password (send email) form
          <form onSubmit={forgotUserEmail} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-stone-700 dark:text-gray-300"
              >
                Enter your email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 bg-white dark:bg-gray-800 text-stone-900 dark:text-white border border-stone-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-500 text-sm">{message}</p>}
            <button
              type="submit"
              className="w-full font-semibold py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-700 text-white transition-colors duration-200"
              disabled={buttonDisabled}
            >
              Send Reset Link
            </button>
          </form>
        )}
        <p className="mt-4 text-center text-stone-700 dark:text-gray-300">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
