"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { setActiveTab } from "../store/uiSlice";

export default function Navigation() {
  const dispatch = useDispatch<AppDispatch>();
  const { activeTab } = useSelector((state: RootState) => state.ui);
  const { wallets }: any = useSelector((state: RootState) => state.wallet);

  const tabs = [
    { id: "generate", label: "Generate Wallet", icon: "plus" },
    {
      id: "wallets",
      label: "My Wallets",
      icon: "wallet",
      badge: wallets.length,
    },
  ] as const;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "plus":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        );
      case "wallet":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Bitcoin Wallet Keeper
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => dispatch(setActiveTab(tab.id))}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors relative ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}>
                {getIcon(tab.icon)}
                <span className="ml-2">{tab.label}</span>
                {"badge" in tab && tab.badge > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
