import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './UserProvider';

function Login() {
  const { setUser } = useContext(UserContext); // Access context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      if (response.data.success) {
        const { id, name, phone, email } = response.data.data;

        // Save user data in localStorage
        localStorage.setItem('user', JSON.stringify({ id, name, phone, email }));

        // Update context state
        setUser({ id, name, phone, email });

        // Redirect to the home page
        navigate('/');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="flex flex-col gap-3 justify-center items-center">
      <form onSubmit={handleLogin}>
        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-500 px-3 py-2 rounded-md w-[250px]"
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-500 px-3 py-2 rounded-md w-[250px]"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <span>
          Don't have an account? <Link to="/register" className="text-blue-600">Register here</Link>
        </span>
        <div className="flex items-end justify-end m-2">
          <button type="submit" className="w-[200px] border px-3 py-2 border-gray-500">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
