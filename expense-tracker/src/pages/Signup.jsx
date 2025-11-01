import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../features/authslice";

export default function SignupPage() {
  const { user, loading, error } = useSelector((state) => state.auth);
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const dispatch = useDispatch();

  if (loading) return <p className="text-white text-center">Checking authentication...</p>;
  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData()
    formData.append("fullName",fullName)
    formData.append("emailAddress",emailAddress)
    formData.append("password",password)
    formData.append("profileImage",profileImage)


    dispatch(register(formData));
    setFullName("");
    setEmail("");
    setPassword("");
    setProfileImage("");
  };

 

  return (
    <>
      <h2 className="text-2xl sm:text-3xl lg:text-4½½xl font-bold text-white mb-2 lg:mb-3 text-center lg:text-left">
        Create Account
      </h2>
      <p className="text-gray-300 mb-6 sm:mb-8 lg:mb-10 text-sm sm:text-base lg:text-lg text-center lg:text-left">
        Start tracking like a pro
      </p>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 lg:space-y-8">
        {/* Grid: 1 column on mobile, 2 on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-200 mb-2 lg:mb-3">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 sm:px-6 py-4 sm:py-5 bg-white/20 hover:bg-white/25 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-indigo-900 transition-colors duration-200 text-base sm:text-lg lg:text-xl"
              placeholder="Enter full name"
              required
            />
          </div>

          {/* Profile Image - Mobile: Stacked, Desktop: Side by side */}
          <div className="flex flex-col sm:flex-row items-center gap-3 lg:gap-4">
            <div className="relative">
              <div
                className={`rounded-full bg-gradient-to-br from-purple-500 to-pink-500 ring-2 ring-white/30 shadow-lg shrink-0 ${
                  profileImage ? "p-1" : ""
                }`}
                style={{
                  width: profileImage ? "56px" : "48px",
                  height: profileImage ? "56px" : "48px",
                  transition: "all 0.3s ease",
                }}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full" />
                )}
              </div>
            </div>

            <label className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-3 rounded-xl bg-white/20 hover:bg-white/25 border border-white/30 text-white cursor-pointer transition-colors duration-200 text-sm lg:text-base font-medium">
              <svg
                className="w-5 h-5 text-pink-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e)=>{setProfileImage(e.target.files[0])}}
                className="hidden"
              />
            </label>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-200 mb-2 lg:mb-3">
              Email
            </label>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 sm:px-6 py-4 sm:py-5 bg-white/20 hover:bg-white/25 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-indigo-900 transition-colors duration-200 text-base sm:text-lg lg:text-xl"
              placeholder="you@company.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm lg:text-base font-medium text-gray-200 mb-2 lg:mb-3">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 sm:px-6 py-4 sm:py-5 bg-white/20 hover:bg-white/25 border border-white/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-indigo-900 transition-colors duration-200 text-base sm:text-lg lg:text-xl"
              placeholder="Create strong password"
              required
            />
          </div>
        </div>

        {/* Error Message */}
{error && (
  <div className="rounded-xl bg-rose-500/10 border border-rose-300 text-rose-300 p-4 text-sm sm:text-base">
    {typeof error === "string" ? error : error.message || "Something went wrong"}
  </div>
)}


        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 sm:py-5 bg-gradient-to-r from-pink-600 to-purple-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] active:scale-100 transition-all duration-300 text-base sm:text-lg lg:text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-purple-700"
        >
          Create Account
        </button>
      </form>

      {/* Login Link */}
      <p className="mt-6 sm:mt-8 lg:mt-10 text-center text-gray-300 text-sm sm:text-base lg:text-lg">
        Already have an account?{" "}
        <Link
          to="/"
          className="text-pink-300 font-semibold hover:underline"
        >
          Log In
        </Link>
      </p>
    </>
  );
}