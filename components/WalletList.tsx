'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { loadWallets, selectWallet, deleteWallet } from '../store/walletSlice';
import { setActiveTab, addNotification } from '../store/uiSlice';

export default function WalletList() {
  const dispatch = useDispatch<AppDispatch>();
  const { wallets } = useSelector((state: RootState) => state.wallet);

  useEffect(() => {
    dispatch(loadWallets());
  }, [dispatch]);

  const handleSelectWallet = (wallet: any) => {
    dispatch(selectWallet(wallet));
    dispatch(setActiveTab('wallet-detail'));
  };

  const handleDeleteWallet = (address: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this wallet? This action cannot be undone.')) {
      dispatch(deleteWallet(address));
      dispatch(addNotification({ type: 'success', message: 'Wallet deleted successfully' }));
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Wallets</h2>
              <p className="text-gray-600 mt-1">Manage your Bitcoin wallets</p>
            </div>
            <div className="text-sm text-gray-500">
              {wallets.length} wallet{wallets.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        <div className="p-6">
          {wallets.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No wallets found</h3>  
              <p className="mt-1 text-sm text-gray-500">Get started by generating your first wallet.</p>
              <div className="mt-6">
                <button
                  onClick={() => dispatch(setActiveTab('generate'))}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Generate Wallet
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {wallets.map((wallet) => (
                <div
                  key={wallet.address}
                  onClick={() => handleSelectWallet(wallet)}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 font-mono">
                            {formatAddress(wallet.address)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Created: {formatDate(wallet.lastUpdated)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {wallet.balance && (
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {parseFloat(wallet.balance).toFixed(6)} ETH
                          </p>
                          <p className="text-xs text-gray-500">Balance</p>
                        </div>
                      )}
                      
                      <button
                        onClick={(e) => handleDeleteWallet(wallet.address, e)}
                        className="p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}