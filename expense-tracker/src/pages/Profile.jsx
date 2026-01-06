import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authslice";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth || {});

  const fullName = user?.fullName
  const email = user?.emailAddress
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-9 text-white p-4 sm:p-6"
    >
      {/* ✅ Header Section with Floating Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.3 }
        }}
        className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-[#111827]/70 backdrop-blur-md border border-slate-700/60 rounded-2xl p-6 shadow-lg hover:shadow-pink-500/10 transition-all duration-300"
      >
        <motion.img
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.2, 
            type: "spring", 
            stiffness: 100 
          }}
          whileHover={{ 
            scale: 1.1,
            rotate: 5,
            transition: { duration: 0.3 }
          }}
          src={profileImg}
          alt="avatar"
          className="h-24 w-24 rounded-full ring-2 ring-pink-400/40 object-cover"
        />

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-1 text-center sm:text-left"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, }}
            className="text-3xl font-bold tracking-tight text-white"
          >
            {fullName}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400"
          >
            {email}
          </motion.p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 20px rgba(236, 72, 153, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch(logout())}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 text-white font-medium shadow-lg hover:opacity-90 transition-all disabled:opacity-50 w-full sm:w-auto"
        >
          {loading ? "Logging out..." : "Logout"}
        </motion.button>
      </motion.div>

      {/* ✅ Error Message with Animation */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, height: 0 }}
            animate={{ opacity: 1, scale: 1, height: "auto" }}
            exit={{ opacity: 0, scale: 0.8, height: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-rose-200 text-center font-medium"
          >
            {String(error)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Stats Cards with Stagger Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, type: "spring" }}
          whileHover={{ 
            scale: 1.03,
            y: -5,
            transition: { duration: 0.2 }
          }}
          className="rounded-2xl bg-gradient-to-br from-pink-500/10 to-pink-600/5 border border-pink-500/30 p-6 shadow-inner hover:shadow-pink-500/20 transition-all"
        >
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-gray-400"
          >
            Member since
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="mt-1 text-2xl font-semibold text-pink-300"
          >
            {createdAt}
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, type: "spring" }}
          whileHover={{ 
            scale: 1.03,
            y: -5,
            transition: { duration: 0.2 }
          }}
          className="rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/30 p-6 shadow-inner hover:shadow-cyan-500/20 transition-all"
        >
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-gray-400"
          >
            Last updated
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, type: "spring" }}
            className="mt-1 text-2xl font-semibold text-cyan-300"
          >
            {updatedAt}
          </motion.p>
        </motion.div>
      </motion.div>

      {/* ✅ Account Details Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, type: "spring" }}
        whileHover={{ 
          scale: 1.01,
          transition: { duration: 0.3 }
        }}
        className="rounded-2xl bg-[#111827]/70 border border-slate-700/60 p-6 shadow-lg"
      >
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="text-2xl font-semibold mb-6 text-white tracking-tight flex items-center gap-3"
        >
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.9, type: "spring" }}
            className="p-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg"
          >
            <motion.span
              animate={{ 
                rotate: [0, 10, -10, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="text-lg"
            >
              👤
            </motion.span>
          </motion.div>
          Account Details
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            whileHover={{ x: 5 }}
          >
            <label className="block text-sm text-gray-400 mb-2">
              Full Name
            </label>
            <motion.div 
              whileHover={{ 
                backgroundColor: "rgba(30, 41, 59, 0.8)",
                borderColor: "rgba(236, 72, 153, 0.4)"
              }}
              className="w-full px-4 py-3 rounded-xl bg-[#1e293b] border border-slate-600 text-white transition-all duration-300"
            >
              {fullName}
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            whileHover={{ x: 5 }}
          >
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <motion.div 
              whileHover={{ 
                backgroundColor: "rgba(30, 41, 59, 0.8)",
                borderColor: "rgba(6, 182, 212, 0.4)"
              }}
              className="w-full px-4 py-3 rounded-xl bg-[#1e293b] border border-slate-600 text-white transition-all duration-300"
            >
              {email}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}