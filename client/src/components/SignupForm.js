import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Customer", // Default role
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email address";
    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); // Store JWT
        localStorage.setItem("user_role", data.role); // Store user role
        alert("Account created successfully!");
        navigate("/dashboard"); // Redirect after signup
      } else {
        setErrors({ apiError: data.message || "Signup failed" });
      }
    } catch (error) {
      setErrors({ apiError: "Server error. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-amber-600 mb-6 text-center">Create Account</h2>

        {errors.apiError && <p className="text-red-500 text-center mb-4">{errors.apiError}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 bg-gray-700 rounded-lg text-white ${errors.name ? "border-2 border-red-500" : ""}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 bg-gray-700 rounded-lg text-white ${errors.email ? "border-2 border-red-500" : ""}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 bg-gray-700 rounded-lg text-white ${errors.password ? "border-2 border-red-500" : ""}`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-3 bg-gray-700 rounded-lg text-white ${errors.confirmPassword ? "border-2 border-red-500" : ""}`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 rounded-lg text-white"
            >
              <option value="Customer">Customer</option>
              <option value="Driver">Driver</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-amber-600 text-white py-3 rounded-lg transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-amber-700"
            }`}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-gray-400 text-center mt-4">
            Already have an account? <span className="text-amber-600 hover:underline cursor-pointer">Login here</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
