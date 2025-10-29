import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex bg-[#0b1220] text-white font-sans">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 lg:py-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl bg-[#1f2937] border border-slate-700/60">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
