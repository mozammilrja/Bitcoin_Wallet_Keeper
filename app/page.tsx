'use client';

import { Provider } from 'react-redux';
import { store } from '../store';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Navigation from '../components/Navigation';
import WalletGenerator from '../components/WalletGenerator';
import WalletList from '../components/WalletList';
import WalletDetail from '../components/WalletDetail';
import Notifications from '../components/Notifications';

function AppContent() {
  const { activeTab } = useSelector((state: RootState) => state.ui);

  const renderContent = () => {
    switch (activeTab) {
      case 'generate':
        return <WalletGenerator />;
      case 'wallets':
        return <WalletList />;
      case 'wallet-detail':
        return <WalletDetail />;
      default:
        return <WalletGenerator />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
      <Notifications />
    </div>
  );
}

export default function Home() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}