import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', monthlyIncome: 30000,
  });
  
  // NEW: State for feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message on new attempt

    // 1. Client-side Validation (DSA brain!)
    if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }

    setLoading(true); // 2. Start Loading

    try {
      const response = await api.post('/auth/register', formData);
      login(response.data.token); 
      navigate('/dashboard');
    } catch (err) {
      // 3. Catch Backend Errors (like "Email already exists")
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false); // 4. Stop Loading (whether success or fail)
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Join TaxTrace</h2>
        
        {/* Error Alert Box */}
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                {error}
            </div>
        )}
        
        <input 
          type="text" placeholder="Name" className="w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        
        <input 
          type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        
        <input 
          type="password" placeholder="Password (min 6 chars)" className="w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />

        <label className="text-sm font-semibold text-gray-600">Monthly Income (INR)</label>
        <input 
          type="number" className="w-full p-2 mb-6 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.monthlyIncome}
          onChange={(e) => setFormData({...formData, monthlyIncome: e.target.value})}
          required
        />

        {/* 5. Dynamic Button State */}
        <button 
            type="submit" 
            disabled={loading}
            className={`w-full p-2 rounded text-white font-semibold transition ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;