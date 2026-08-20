import { useState, useEffect } from 'react';
import { FiX, FiCheckCircle, FiLoader, FiAlertTriangle, FiArrowRight } from 'react-icons/fi';

export default function PurchaseModal({ listing, onClose }) {
  // States: 'select_quantity' | 'review' | 'processing' | 'success' | 'error'
  const [step, setStep] = useState('select_quantity');
  const [quantity, setQuantity] = useState(1);
  
  const pricePerTon = Number(listing?.price_per_credit || 0);
  const maxAvailable = Number(listing?.amount_available || 0);
  const totalCost = quantity * pricePerTon;

  const handleNext = () => {
    if (step === 'select_quantity') setStep('review');
    else if (step === 'review') handlePurchase();
  };

  const handlePurchase = () => {
    setStep('processing');
    
    // MOCK TRANSACTION FLOW
    // In a real implementation, this would trigger wallet connection, sign transaction, and hit the backend API.
    setTimeout(() => {
      // Fake 90% success rate for demonstration
      if (Math.random() > 0.1) {
        setStep('success');
      } else {
        setStep('error');
      }
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm" 
        onClick={() => (step !== 'processing') && onClose()} 
      />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-lg shadow-2xl flex flex-col transform transition-all border border-gray-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs uppercase tracking-widest border border-emerald-100">
              Buy
            </div>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Carbon Credits</h3>
          </div>
          {step !== 'processing' && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-gray-50">
              <FiX size={20} />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8">
          
          {step === 'select_quantity' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">{listing.project_title}</h4>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{listing.country || 'Global'} • CXP-{listing.project_id}</p>
              </div>

              <div className="bg-gray-50 p-6 border border-gray-200 flex flex-col items-center justify-center">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Select Quantity (tCO₂e)</label>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-bold text-xl"
                  >
                    -
                  </button>
                  
                  <div className="w-32 relative">
                    <input 
                      type="number" 
                      min="1" 
                      max={maxAvailable}
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setQuantity(Math.min(maxAvailable, Math.max(1, val)));
                      }}
                      className="w-full text-center text-3xl font-black text-gray-900 bg-transparent border-none focus:ring-0 p-0"
                    />
                    <div className="absolute -bottom-6 left-0 right-0 text-center text-xs font-semibold text-gray-500">
                      Max: {maxAvailable.toLocaleString()}
                    </div>
                  </div>

                  <button 
                    onClick={() => setQuantity(Math.min(maxAvailable, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-bold text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-gray-100 pt-6">
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Cost</span>
                  <span className="text-2xl font-black text-emerald-600">₹{totalCost.toLocaleString('en-IN')}</span>
                </div>
                <button 
                  onClick={handleNext}
                  className="bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 transition-colors flex items-center gap-2"
                >
                  Review Order <FiArrowRight />
                </button>
              </div>

            </div>
          )}

          {step === 'review' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              
              <div className="bg-gray-900 text-white p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Order Summary</h4>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-start border-b border-gray-700 pb-4">
                    <div>
                      <p className="font-bold text-lg leading-tight mb-1">{listing.project_title}</p>
                      <p className="text-gray-400 text-sm">Carbon Credit (CXPT)</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-medium">Quantity</span>
                    <span className="font-bold">{quantity.toLocaleString()} tCO₂e</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-medium">Price per unit</span>
                    <span className="font-bold">₹{pricePerTon.toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                    <span className="text-gray-300 font-bold uppercase tracking-wider text-xs">Total</span>
                    <span className="font-black text-2xl text-emerald-400">₹{totalCost.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-4 text-sm text-blue-800 flex items-start gap-3">
                <FiAlertTriangle className="shrink-0 mt-0.5 text-blue-600" />
                <p>You will be prompted to sign the transaction. Ensure your wallet is connected and has sufficient balance.</p>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => setStep('select_quantity')}
                  className="w-1/3 border border-gray-300 bg-white text-gray-700 font-bold py-3 hover:bg-gray-50 transition-colors text-sm"
                >
                  Back
                </button>
                <button 
                  onClick={handleNext}
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 transition-colors text-sm shadow-md"
                >
                  Confirm & Pay
                </button>
              </div>

            </div>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                <FiLoader className="absolute inset-0 m-auto text-emerald-600 opacity-0" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Transaction</h3>
              <p className="text-sm text-gray-500 max-w-xs">
                Please wait while we interact with the smart contract and verify your purchase on the blockchain.
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 border border-emerald-100">
                <FiCheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Purchase Successful</h3>
              <p className="text-sm text-gray-600 mb-8 max-w-sm">
                You have successfully purchased and retired <strong className="text-gray-900">{quantity.toLocaleString()} tCO₂e</strong> from {listing.project_title}.
              </p>
              <button 
                onClick={onClose}
                className="bg-gray-900 hover:bg-black text-white font-bold py-3 px-12 transition-colors"
              >
                Return to Marketplace
              </button>
            </div>
          )}

          {step === 'error' && (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6 border border-red-100">
                <FiAlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Transaction Failed</h3>
              <p className="text-sm text-gray-600 mb-8 max-w-sm">
                There was an issue processing your transaction. This might be due to insufficient funds or a network error.
              </p>
              <div className="flex gap-4 w-full">
                <button 
                  onClick={onClose}
                  className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setStep('review')}
                  className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-3 transition-colors text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
