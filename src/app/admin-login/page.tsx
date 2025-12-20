"use client"
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const page = () => {

  const route = useRouter()

  const [formData, setFormData] = useState({
    identifier: "", // email or phone number
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Login Data:", formData);

    // API call goes here

    try {
      const response = await axios.post("/api/v1/user/login-admin", formData)

      console.log(response.data)

      toast.success(response.data.message)

      setTimeout(() => {
        route.push("/admin")
      }, 3000);
      
    } catch (error:any) {
      console.log(error.response.data.message)

      toast.error(error.response.data.message)

    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="identifier"
            placeholder="Email or Phone Number"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Forgot password?{" "}
          <span className="text-black font-medium cursor-pointer hover:underline">
            Reset here
          </span>
        </p>
      </div>
    </div>
  );
};

export default page
