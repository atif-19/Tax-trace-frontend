import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/dashboard" className="text-xl font-bold text-indigo-600">TaxTrace 🚀</Link>
      
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600">Home</Link>
            <Link to="/scanner" className="text-gray-600 hover:text-indigo-600 font-semibold">+ Scan Item</Link>
            <button 
              onClick={handleLogout}
              className="bg-red-50 text-red-600 px-3 py-1 rounded-lg border border-red-200"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="text-indigo-600">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;