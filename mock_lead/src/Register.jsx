import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', formData);
      alert(response.data.message); // Success message
      navigate('/login');
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error); // Error message from server
      } else {
        alert('Something went wrong. Please try again later.');
      }
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-3 justify-center items-center">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-500 px-3 py-2 rounded-md w-[250px]"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-500 px-3 py-2 rounded-md w-[250px]"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="border border-gray-500 px-3 py-2 rounded-md w-[250px]"
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-500 px-3 py-2 rounded-md w-[250px]"
          />
        </div>
        <span>
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600">
            Login here
          </Link>
        </span>
        <div className="flex items-end justify-end m-2">
          <button type="submit" className="w-[200px] border px-3 py-2 border-gray-500">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
