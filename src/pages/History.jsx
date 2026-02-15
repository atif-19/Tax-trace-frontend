import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const History = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get('/scans/history');
        
        // Your JSON structure is { data: [...] }
        // We access response.data.data
        setScans(response.data.data || []);
      } catch (err) {
        setError("Could not load your history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);
  // --- CALCULATE TOTALS FROM CURRENT DATA ---
  const totalTaxInView = scans.reduce((sum, scan) => sum + (scan.totalGstAmount || 0), 0);
  const totalSpentInView = scans.reduce((sum, scan) => sum + (scan.pricePaid || 0), 0);

  if (loading) return <div className="p-10 text-center font-bold text-indigo-600 animate-bounce">Fetching History...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto min-h-screen bg-white">
      <header className="mb-6">
        <h1 className="text-3xl font-black text-gray-900">History</h1>
        <p className="text-gray-500 text-sm font-medium">Detailed breakdown of your tax contributions.</p>
      </header>

      {/* --- NEW ANALYTICS SUMMARY CARD --- */}
      <div className="bg-gray-900 text-white p-6 rounded-3xl mb-10 shadow-xl flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total GST Tracked</p>
          <p className="text-3xl font-black text-red-400">₹{totalTaxInView.toFixed(2)}</p>
        </div>
        <div className="text-right border-l border-gray-700 pl-6">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Spend</p>
          <p className="text-xl font-bold">₹{totalSpentInView.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-6">
        {scans.length > 0 ? (
          scans.map((scan) => (
            <div key={scan._id} className="flex gap-4 items-start border-b pb-6 border-gray-100 last:border-0">
              <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                <img 
                  src={scan.product?.image} 
                  alt={scan.product?.name} 
                  className="w-full h-full object-contain p-1"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                />
              </div>

              <div className="flex-grow">
                <h3 className="text-md font-bold text-gray-800 leading-tight">
                  {scan.product?.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                   ₹{scan.pricePaid} (Qty: {scan.quantity})
                </p>
                <p className="text-[10px] text-gray-400 mt-1 font-mono uppercase">
                  {new Date(scan.date).toLocaleDateString('en-IN', { 
                    day: '2-digit', month: 'short' 
                  })}
                </p>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-red-500">
                  + ₹{scan.totalGstAmount?.toFixed(2)}
                </span>
                <p className="text-[10px] font-bold text-gray-400 uppercase">GST</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-400">No records found.</div>
        )}
      </div>
    </div>
  );
};

export default History;