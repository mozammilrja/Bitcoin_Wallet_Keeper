/**
 * @jest-environment jsdom
 */

import { StorageUtils } from '../utils/storage';
import { WalletInfo } from '../store/walletSlice';

const mockWallet: WalletInfo = {
  address: '0x742C4A0b4a3eE9D4B5FA87b6db3e0c4e7c7d8c2c',
  encryptedJson: '{"version":3,"id":"test","crypto":{"cipher":"aes-128-ctr"}}',
  balance: '1.234567',
  lastUpdated: new Date().toISOString(),
};

describe('StorageUtils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should return empty array when no wallets stored', () => {
    const wallets = StorageUtils.getWallets();
    expect(wallets).toEqual([]);
  });

  test('should save and retrieve wallets', () => {
    const wallets = [mockWallet];
    StorageUtils.saveWallets(wallets);
    
    const retrievedWallets = StorageUtils.getWallets();
    expect(retrievedWallets).toEqual(wallets);
  });

  test('should add new wallet', () => {
    StorageUtils.addWallet(mockWallet);
    
    const wallets = StorageUtils.getWallets();
    expect(wallets).toHaveLength(1);
    expect(wallets[0]).toEqual(mockWallet);
  });

  test('should update existing wallet', () => {
    StorageUtils.addWallet(mockWallet);
    
    const updatedWallet = { ...mockWallet, balance: '2.345678' };
    StorageUtils.addWallet(updatedWallet);
    
    const wallets = StorageUtils.getWallets();
    expect(wallets).toHaveLength(1);
    expect(wallets[0].balance).toBe('2.345678');
  });

  test('should remove wallet', () => {
    StorageUtils.addWallet(mockWallet);
    expect(StorageUtils.getWallets()).toHaveLength(1);
    
    StorageUtils.removeWallet(mockWallet.address);
    expect(StorageUtils.getWallets()).toHaveLength(0);
  });

  test('should update wallet balance', () => {
    StorageUtils.addWallet(mockWallet);
    
    StorageUtils.updateWalletBalance(mockWallet.address, '3.456789');
    
    const wallets = StorageUtils.getWallets();
    expect(wallets[0].balance).toBe('3.456789');
    expect(wallets[0].lastUpdated).toBeDefined();
  });

  test('should export and import wallets', () => {
    const wallets = [mockWallet];
    StorageUtils.saveWallets(wallets);
    
    const exported = StorageUtils.exportWallets();
    expect(typeof exported).toBe('string');
    
    localStorage.clear();
    const imported = StorageUtils.importWallets(exported);
    expect(imported).toBe(true);
    
    const retrievedWallets = StorageUtils.getWallets();
    expect(retrievedWallets).toEqual(wallets);
  });

  test('should clear all data', () => {
    StorageUtils.addWallet(mockWallet);
    expect(StorageUtils.getWallets()).toHaveLength(1);
    
    StorageUtils.clearAllData();
    expect(StorageUtils.getWallets()).toHaveLength(0);
  });
});