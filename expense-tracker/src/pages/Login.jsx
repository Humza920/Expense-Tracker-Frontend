// src/pages/LoginPage.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {useDispatch} from "react-redux";
import { login } from "../features/authslice";

export default function LoginPage() {
  const [emailAddress, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch()
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({emailAddress,password}))
    setEmail("")
    setPassword("")
  };

  return (
    <>
      <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2 lg:mb-3">
        Welcome Back
      </h2>
      <p className="text-gray-300 mb-8 lg:mb-10 text-base lg:text-lg">
        Log in to manage your finances
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
        <div>
          <label className="block text-sm lg:text-base font-medium text-gray-200 mb-3">
            Email
          </label>
          <input
            type="email"
            value={emailAddress}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-5 bg-white/20 hover:bg-white/25 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-indigo-900 transition-colors duration-200 text-lg lg:text-xl"
            placeholder="you@company.com"
          />
        </div>

        <div>
          <label className="block text-sm lg:text-base font-medium text-gray-200 mb-3">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-6 py-5 bg-white/20 hover:bg-white/25 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-indigo-900 transition-colors duration-200 text-lg lg:text-xl"
          />
        </div>

        <button
          type="submit"
          className="w-full py-5 bg-gradient-to-r from-pink-600 to-purple-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] active:scale-100 transition-transform duration-300 text-lg lg:text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-purple-700"
        >
          Login Securely
        </button>
      </form>

      <p className="mt-8 lg:mt-10 text-center text-gray-300 text-base lg:text-lg">
        New here?{" "}
        <Link
          to="/signup"
          className="text-pink-300 font-semibold hover:underline"
        >
          Create Account
        </Link>
      </p>
    </>
  );
}
