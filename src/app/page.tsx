"use client";
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const page = () => {
  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8"
      >
        <h1 className="text-5xl font-bold tracking-tight">
          Admin Portal
        </h1>


        <p className="text-gray-600 max-w-md mx-auto">
          A minimal, modern black & white interface for managing your system
        </p>


        <div className="flex gap-6 justify-center">
          <Link
            href="/admin-registration"
            className="px-8 py-3 border-2 border-black rounded-full font-medium transition-all duration-300 hover:bg-black hover:text-white"
          >
            Admin Register
          </Link>


          <Link
            href="/admin-login"
            className="px-8 py-3 bg-black text-white rounded-full font-medium transition-all duration-300 hover:bg-gray-900"
          >
            Admin Login
          </Link>
        </div>


        <div className="pt-10 text-sm text-gray-400">
          © {new Date().getFullYear()} Code AI Technology
        </div>
      </motion.div>
    </div>
  )
}

export default page
