import React, { useState } from 'react';
import api from '../api/axiosConfig';
import BarcodeScanner from '../components/BarcodeScanner';

const Scanner = () => {
  const [step, setStep] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [pricePaid, setPricePaid] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  const processLookup = async (barcodeValue) => {
    if (!barcodeValue || loading) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/products/lookup', { barcode: barcodeValue });
      
      // Your backend structure: { success: true, data: { name, image, barcode... } }
      if (response.data && response.data.data) {
        setProduct(response.data.data); 
        setStep(2);
        setShowCamera(false);
      } else {
        setError("Product found but details are missing.");
      }
    } catch (err) {
      console.error("Lookup Error:", err);
      setError("Product not found. You can try another barcode.");
    } finally {
      setLoading(false);
    }
  };

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    
    if (!product) {
        setError("Session error. Please scan again.");
        setStep(1);
        return;
    }

    setLoading(true);
    try {
      const payload = {
        barcode: product.barcode,
        name: product.name,
        image: product.image, // Send the image URL back to be saved
        pricePaid: Number(pricePaid),
        quantity: Number(quantity),
        gstRate: product.gstRate || 18
      };

      await api.post('/scans', payload);

      alert("Added to your tax history!");
      
      setStep(1);
      setProduct(null);
      setPricePaid('');
      setQuantity(1);
      setManualBarcode('');
    } catch (err) {
      console.error("Save Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to save scan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700 text-center">
        TaxTrace Scanner
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm text-center">
          {error}
        </div>
      )}

      {step === 1 ? (
        <div className="space-y-6">
          {!showCamera ? (
            <>
              <button
                onClick={() => setShowCamera(true)}
                className="w-full bg-indigo-600 text-white py-12 rounded-2xl shadow-xl flex flex-col items-center gap-2 hover:bg-indigo-700 transition-all"
              >
                <span className="text-5xl">📷</span>
                <span className="font-bold">Tap to Scan Barcode</span>
              </button>

              <div className="flex items-center gap-2 text-gray-400">
                <hr className="flex-grow border-gray-300" />
                <span className="text-xs font-bold uppercase">OR</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Type Barcode Manually
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-grow border-2 border-gray-100 p-3 rounded-xl focus:border-indigo-500 outline-none transition"
                    value={manualBarcode}
                    onChange={(e) => setManualBarcode(e.target.value)}
                  />
                  <button
                    onClick={() => processLookup(manualBarcode)}
                    disabled={loading || !manualBarcode}
                    className="bg-indigo-600 text-white px-4 rounded-xl disabled:bg-gray-300 font-bold"
                  >
                    Go
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <BarcodeScanner onScanSuccess={processLookup} />
              <button
                onClick={() => setShowCamera(false)}
                className="w-full py-2 text-gray-500 underline font-semibold"
              >
                Cancel & Type Manually
              </button>
            </div>
          )}
        </div>
      ) : (
        <form
          onSubmit={handleScanSubmit}
          className="bg-white p-6 shadow-2xl rounded-2xl space-y-5 animate-in fade-in zoom-in duration-300"
        >
          <div className="text-center">
            {/* --- NEW IMAGE SECTION --- */}
            {product?.image ? (
              <div className="mb-4">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-32 h-32 mx-auto object-contain rounded-lg border bg-gray-50 p-2"
                />
              </div>
            ) : (
              <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📦</span>
              </div>
            )}
            {/* ------------------------- */}
            
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
              Product Found
            </span>
            <h2 className="text-xl font-extrabold text-gray-800">
              {product?.name}
            </h2>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600">
              Amount Paid (Total)
            </label>
            <input
              type="number"
              className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 outline-none transition"
              value={pricePaid}
              onChange={(e) => setPricePaid(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600">
              Quantity
            </label>
            <input
              type="number"
              className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 outline-none transition"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:shadow-lg disabled:bg-gray-400 transition-all"
          >
            {loading ? 'Processing...' : 'Confirm & Save'}
          </button>
          
          <button 
            type="button"
            onClick={() => setStep(1)} 
            className="w-full text-gray-400 text-sm font-medium"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default Scanner;