"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { toast } from "react-toastify";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        // Handle server-side errors
        const errorData = await response.json();
        toast.error(errorData.message || "Error logging in");
      } else {
        // Handle successful login
        const { token } = await response.json();
        toast.success("Login successful!");
        localStorage.setItem("token", token);
        window.location.href = "/"; // Redirect to home page
      }
    } catch (error) {
      // Handle client-side errors (e.g., network issues)
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg overflow-hidden"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        {/* Username */}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none disabled:opacity-50 flex items-center justify-center"
          disabled={loading} // Disable button when loading
        >
          {loading && (
            <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin mr-2"></div>
          )}
          {!loading && "Login"}
        </button>
      </form>
    </div>
  );
}
