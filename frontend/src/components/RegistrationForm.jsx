import React, { useState } from 'react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form validation and submission logic here
    console.log(formData);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
