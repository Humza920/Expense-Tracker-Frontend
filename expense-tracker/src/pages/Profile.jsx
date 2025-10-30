import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authslice";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth || {});

  const fullName = user?.fullName || "—";
  const email = user?.emailAddress || user?.email || "—";
  const profileImg =
    user?.profileImg ||
    "https://cdn-icons-png.flaticon.com/512/847/847969.png";
  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "—";
  const updatedAt = user?.updatedAt
    ? new Date(user.updatedAt).toLocaleDateString()
    : "—";

  return (
    <div className="space-y-9 text-white animate-fadeIn">
   
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-[#0b1220]/70 backdrop-blur-md border border-slate-700/60 rounded-2xl p-6 shadow-lg hover:shadow-pink-500/10 transition-all duration-300">
        <img
          src={profileImg}
          alt="avatar"
          className="h-24 w-24 rounded-full ring-2 ring-pink-400/40 object-cover hover:scale-105 transition-transform duration-300"
        />

        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {fullName}
          </h1>
          <p className="text-gray-400">{email}</p>
        </div>

        <button
          onClick={() => dispatch(logout())}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-medium shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-rose-200 text-center font-medium animate-fadeIn">
          {String(error)}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-gradient-to-br from-[#111827]/80 to-[#0b1220]/70 border border-slate-700/60 p-6 shadow-inner hover:shadow-cyan-500/10 transition-all">
          <p className="text-sm text-gray-400">Member since</p>
          <p className="mt-1 text-2xl font-semibold text-fuchsia-300">
            {createdAt}
          </p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-[#111827]/80 to-[#0b1220]/70 border border-slate-700/60 p-6 shadow-inner hover:shadow-fuchsia-500/10 transition-all">
          <p className="text-sm text-gray-400">Last updated</p>
          <p className="mt-1 text-2xl font-semibold text-cyan-300">
            {updatedAt}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-[#111827]/80 to-[#0b1220]/70 border border-slate-700/60 p-8 shadow-lg hover:shadow-pink-500/10 transition-all">
        <h2 className="text-2xl font-semibold mb-6 text-white tracking-tight">
          Account Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Full Name
            </label>
            <input
              type="text"
              defaultValue={fullName}
              className="w-full px-4 py-3 rounded-xl bg-[#0b1220]/90 border border-slate-700/60 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/40 transition-all"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <input
              type="email"
              defaultValue={email}
              className="w-full px-4 py-3 rounded-xl bg-[#0b1220]/90 border border-slate-700/60 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
