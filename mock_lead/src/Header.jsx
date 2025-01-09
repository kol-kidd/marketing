import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserProvider';

function Header() {
  const { user, setUser } = useContext(UserContext); // Access user state
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null); // Clear user state
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="techies.jpg" className="h-8 rounded-full" alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Techies</span>
        </a>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link to="/" className="block py-2 px-3 rounded md:p-0 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500">
                Home
              </Link>
            </li>
            {user ? (
              <li className="relative">
                <button onClick={toggleDropdown} className="block py-2 px-3 rounded md:p-0 text-gray-900 hover:bg-gray-100">
                  {user.name.slice(0, 4)}
                </button>
                {isDropdownOpen && (
                  <ul className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                    <li>
                      <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            ) : (
              <li>
                <Link to="/login" className="block py-2 px-3 rounded md:p-0 text-gray-900 hover:bg-gray-100">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
