import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  ExclamationCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { productLoanAPI } from '../services/productLoanService';

export default function ProductSelectionModal({ onClose, onSelect }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productLoanAPI.getAll();
      setProducts(response.data);
      // Set default selected if products exist
      if (response.data.length > 0) {
        setSelectedProduct(response.data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      // Fallback to mock data if API fails
      const mockProducts = [
        { id: 'BUSINESS_LOAN', name: 'Business Loan', loan_type: 'Business Loan', description: 'Working capital and expansion financing.' },
        { id: 'LOAN_AGAINST_PROPERTY', name: 'Loan Against Property', loan_type: 'Mortgage/LAP', description: 'Secured loan against residential/commercial property.' },
        { id: 'PERSONAL_LOAN', name: 'Personal Loan', loan_type: 'Personal Loan (Unsecured)', description: 'Unsecured loan for personal use.' },
        { id: 'HOME_LOAN', name: 'Home Loan', loan_type: 'Home Loan', description: 'Financing for purchase of property.' },
      ];
      setProducts(mockProducts);
      setSelectedProduct('BUSINESS_LOAN');
      setError("Using demo data - backend not available");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-scale-in transform transition-all">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Select Loan Product</h2>
            <p className="text-sm text-gray-500 mt-1">Choose the type of application you want to create.</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Product Selection */}
        <div className="p-8 bg-gray-50/50">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600 bg-red-50 rounded-lg">
              <ExclamationCircleIcon className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">{error}</p>
              {error !== "Using demo data - backend not available" && (
                <button 
                  onClick={fetchProducts} 
                  className="mt-4 text-sm underline hover:text-red-800"
                >
                  Retry
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label htmlFor="product-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Loan Product
                </label>
                <div className="relative">
                  <select
                    id="product-select"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none appearance-none bg-white text-gray-900"
                  >
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name || product.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              {selectedProduct && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    {products.find(p => p.id === selectedProduct)?.name || 'Product Details'}
                  </h4>
                  <p className="text-sm text-blue-700">
                    {products.find(p => p.id === selectedProduct)?.description || 
                     products.find(p => p.id === selectedProduct)?.loan_type || 
                     'No description available.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 font-medium hover:bg-white hover:shadow-sm rounded-lg transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              if (!selectedProduct) return;
              const chosen = products.find(p => String(p.id) === String(selectedProduct));
              if (chosen) onSelect(chosen);
            }}
            disabled={!selectedProduct || loading}
            className="px-6 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create Application
          </button>
        </div>
      </div>
    </div>
  );
}
