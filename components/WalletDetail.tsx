'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { decryptWallet, checkBalance, clearPrivateKey } from '../store/walletSlice';
import { addNotification, togglePrivateKey } from '../store/uiSlice';

export default function WalletDetail() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const { currentWallet, privateKey, isLoading, error } = useSelector((state: RootState) => state.wallet);
  const { showPrivateKey } = useSelector((state: RootState) => state.ui);

  if (!currentWallet) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-600">No wallet selected</p>
        </div>
      </div>
    );
  }

  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      dispatch(addNotification({ type: 'error', message: 'Please enter password' }));
      return;
    }

    try {
      await dispatch(decryptWallet({ 
        encryptedJson: currentWallet.encryptedJson, 
        password 
      })).unwrap();
      dispatch(addNotification({ type: 'success', message: 'Wallet decrypted successfully' }));
      setPassword('');
    } catch (error) {
      dispatch(addNotification({ type: 'error', message: 'Invalid password' }));
    }
  };

  const handleCheckBalance = () => {
    if (!currentWallet) return;
    dispatch(checkBalance(currentWallet.address));
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    dispatch(addNotification({ type: 'success', message: `${type} copied to clipboard` }));
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 10)}...${address.slice(-10)}`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Wallet Details</h2>
              <p className="text-gray-600">Manage your wallet securely</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Wallet Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wallet Address
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm">
                {currentWallet.address}
              </div>
              <button
                onClick={() => copyToClipboard(currentWallet.address, 'Address')}
                className="p-3 text-gray-500 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Balance Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Balance (Sepolia Testnet)
              </label>
              <button
                onClick={handleCheckBalance}
                disabled={isLoading}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 flex items-center space-x-1"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Refresh</span>
                  </>
                )}
              </button>
            </div>
            <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">
                {currentWallet.balance !== undefined ? `${parseFloat(currentWallet.balance).toFixed(6)} ETH` : 'Click refresh to check balance'}
              </div>
              {currentWallet.lastUpdated && (
                <div className="text-xs text-gray-500 mt-1">
                  Last updated: {new Date(currentWallet.lastUpdated).toLocaleString()}
                </div>
              )}
              {error && (
                <div className="text-xs text-red-500 mt-1">
                  Error: {error}
                </div>
              )}
            </div>
          </div>

          {/* Private Key Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Private Key
            </label>
            
            {!privateKey ? (
              <form onSubmit={handleDecrypt} className="space-y-4">
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter wallet password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {showPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Decrypting...' : 'View Private Key'}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 px-4 py-3 bg-red-50 border border-red-300 rounded-lg font-mono text-sm">
                    {showPrivateKey ? privateKey : '•'.repeat(64)}
                  </div>
                  <button
                    onClick={() => dispatch(togglePrivateKey())}
                    className="p-3 text-gray-500 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPrivateKey ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                  </button>
                  <button
                    onClick={() => copyToClipboard(privateKey, 'Private key')}
                    className="p-3 text-gray-500 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => dispatch(clearPrivateKey())}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    Hide Private Key
                  </button>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex">
                    <svg className="flex-shrink-0 h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Security Warning</h3>
                      <p className="text-sm text-red-700 mt-1">
                        Never share your private key with anyone. Anyone with access to your private key can control your wallet.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}