import { CryptoUtils } from '../utils/crypto';
import { ethers } from 'ethers';

describe('CryptoUtils', () => {
  test('should generate a valid wallet', async () => {
    const wallet = await CryptoUtils.generateWallet();
    expect(wallet).toBeInstanceOf(ethers.Wallet);
    expect(wallet.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
    expect(wallet.privateKey).toMatch(/^0x[a-fA-F0-9]{64}$/);
  });

  test('should encrypt and decrypt wallet correctly', async () => {
    const wallet = await CryptoUtils.generateWallet();
    const password = 'testpassword123';
    
    const encryptedJson = await CryptoUtils.encryptWallet(wallet, password);
    expect(encryptedJson).toBeTruthy();
    expect(typeof encryptedJson).toBe('string');
    
    const decryptedWallet = await CryptoUtils.decryptWallet(encryptedJson, password);
    expect(decryptedWallet.address).toBe(wallet.address);
    expect(decryptedWallet.privateKey).toBe(wallet.privateKey);
  });

  test('should fail to decrypt with wrong password', async () => {
    const wallet = await CryptoUtils.generateWallet();
    const password = 'testpassword123';
    const wrongPassword = 'wrongpassword';
    
    const encryptedJson = await CryptoUtils.encryptWallet(wallet, password);
    
    await expect(
      CryptoUtils.decryptWallet(encryptedJson, wrongPassword)
    ).rejects.toThrow();
  });

  test('should validate addresses correctly', () => {
    const validAddress = '0x742C4A0b4a3eE9D4B5FA87b6db3e0c4e7c7d8c2c';
    const invalidAddress = 'invalid-address';
    
    expect(CryptoUtils.validateAddress(validAddress)).toBe(true);
    expect(CryptoUtils.validateAddress(invalidAddress)).toBe(false);
  });

  test('should format balance correctly', () => {
    expect(CryptoUtils.formatBalance('0')).toBe('0.000000');
    expect(CryptoUtils.formatBalance('0.123456789')).toBe('0.123457');
    expect(CryptoUtils.formatBalance('0.0000001')).toBe('< 0.000001');
  });

  test('should shorten address correctly', () => {
    const address = '0x742C4A0b4a3eE9D4B5FA87b6db3e0c4e7c7d8c2c';
    const shortened = CryptoUtils.shortenAddress(address);
    expect(shortened).toBe('0x742C...8c2c');
  });
});