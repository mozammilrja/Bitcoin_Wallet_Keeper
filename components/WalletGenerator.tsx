"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { generateWallet, loadWallets } from "../store/walletSlice";
import { addNotification } from "../store/uiSlice";

export default function WalletGenerator() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.wallet);

  useEffect(() => {
    dispatch(loadWallets());
  }, [dispatch]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      dispatch(
        addNotification({ type: "error", message: "Please fill in all fields" })
      );
      return;
    }

    if (password !== confirmPassword) {
      dispatch(
        addNotification({ type: "error", message: "Passwords do not match" })
      );
      return;
    }

    if (password.length < 8) {
      dispatch(
        addNotification({
          type: "error",
          message: "Password must be at least 8 characters long",
        })
      );
      return;
    }

    try {
      await dispatch(generateWallet(password)).unwrap();
      dispatch(
        addNotification({
          type: "success",
          message: "Wallet generated successfully!",
        })
      );
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      dispatch(
        addNotification({ type: "error", message: "Failed to generate wallet" })
      );
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Generate New Wallet
          </h2>
          <p className="text-gray-600">
            Create a secure Bitcoin wallet with password encryption
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPasswords ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter a secure password"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPasswords ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Confirm your password"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="showPasswords"
              checked={showPasswords}
              onChange={(e) => setShowPasswords(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="showPasswords"
              className="ml-2 block text-sm text-gray-700">
              Show passwords
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating...
              </div>
            ) : (
              "Generate Wallet"
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex">
            <svg
              className="flex-shrink-0 h-5 w-5 text-yellow-600"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Security Notice
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Use a strong password. Your wallet will be encrypted and stored
                locally. Never share your private key or password.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
