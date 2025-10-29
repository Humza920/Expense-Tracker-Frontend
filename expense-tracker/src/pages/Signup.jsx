// src/pages/SignupPage.js
import React from "react";
import { Link } from "react-router-dom";


export default function SignupPage() {
  return (
    <>
      <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2 lg:mb-3">Create Account</h2>
      <p className="text-gray-300 mb-8 lg:mb-10 text-base lg:text-lg">Start tracking like a pro</p>

      <form className="space-y-6 lg:space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-200 mb-3">Full Name</label>
            <input
              type="text"
              defaultValue="John Doe"
              className="w-full px-6 py-5 bg-white/20 hover:bg-white/25 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-indigo-900 transition-colors duration-200 text-lg lg:text-xl"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-200 mb-3">Profile Image</label>
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 ring-2 ring-white/30 shadow-lg shrink-0" />
              <label className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/20 hover:bg-white/25 border border-white/30 text-white cursor-pointer transition-colors duration-200">
                <svg className="w-5 h-5 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm lg:text-base font-medium">Upload</span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-200 mb-3">Email</label>
            <input
              type="email"
              defaultValue="you@company.com"
              className="w-full px-6 py-5 bg-white/20 hover:bg-white/25 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-indigo-900 transition-colors duration-200 text-lg lg:text-xl"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-200 mb-3">Password</label>
            <input
              type="password"
              placeholder="Create strong password"
              className="w-full px-6 py-5 bg-white/20 hover:bg-white/25 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-indigo-900 transition-colors duration-200 text-lg lg:text-xl"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-5 bg-gradient-to-r from-pink-600 to-purple-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] active:scale-100 transition-transform duration-300 text-lg lg:text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-purple-700"
        >
          Create Account
        </button>
      </form>

      <p className="mt-8 lg:mt-10 text-center text-gray-300 text-base lg:text-lg">
        Already have account?{" "}
        <Link to="/auth/login" className="text-pink-300 font-semibold hover:underline">
          Log In
        </Link>
      </p>
    </>
  );
}