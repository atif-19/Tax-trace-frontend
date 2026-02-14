import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const Dashboard = () => {
  const [stats, setStats] = useState({ daily: null, monthly: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [dailyRes, monthlyRes] = await Promise.all([
        api.get('/summary/daily'),
        api.get('/summary/monthly')
      ]);

      // LOG: Check the nested structure in your console
      console.log("Daily Data:", dailyRes.data);
      console.log("Monthly Data:", monthlyRes.data);

      setStats({
        daily: dailyRes.data.summary,   // Accessing the .summary object
        monthly: monthlyRes.data.summary // Accessing the .summary object
      });
    } catch (err) {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div className="p-10 text-center">Calculating impact...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-black text-gray-800">Tax Impact Dashboard</h1>
        <p className="text-gray-500">Visualization of your work-time spent on GST.</p>
      </header>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Daily Card */}
        <div className="bg-white border-2 border-indigo-50 p-6 rounded-3xl shadow-sm">
          <h2 className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-2">Today</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-gray-900">
              {stats.daily?.userStats?.minutesWorked || 0}
            </span>
            <span className="text-xl font-bold text-gray-400">Minutes</span>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            GST Paid Today: <span className="font-bold text-gray-900">₹{stats.daily?.totalGstToday || 0}</span>
          </p>
        </div>

        {/* Monthly Card */}
        <div className="bg-indigo-600 p-6 rounded-3xl shadow-xl text-white">
          <h2 className="text-sm font-bold text-indigo-200 uppercase tracking-widest mb-2">
            {stats.monthly?.month || 'This Month'}
          </h2>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black">
              {stats.monthly?.workDaysForTax || 0}
            </span>
            <span className="text-xl font-bold opacity-70">Days</span>
          </div>
          <p className="text-sm opacity-90 mt-4">
            Total Items Scanned: <span className="font-bold">{stats.monthly?.totalItemsScanned || 0}</span>
          </p>
          <p className="text-xs mt-1 opacity-70 text-indigo-100">
            GST consumes {stats.monthly?.taxPercentageOfIncome} of your income.
          </p>
        </div>
      </div>

      {/* Comparisons Section */}
      <section className="bg-gray-100 p-6 rounded-3xl">
        <h3 className="font-bold text-gray-700 mb-4">Relative Tax Burden (Today)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.daily?.comparisons?.map((comp, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm text-center">
              <p className="text-xs text-gray-500 font-bold mb-1">₹{comp.incomeBracket/1000}k Income</p>
              <p className="text-lg font-black text-indigo-600">{comp.workMinutes}m</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;