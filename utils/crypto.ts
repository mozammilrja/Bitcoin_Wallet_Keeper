import {
  HDNodeWallet,
  isAddress,
  JsonRpcProvider,
  formatEther,
  Wallet as EthersWallet,
} from 'ethers';

export class CryptoUtils {
  static async generateWallet(): Promise<HDNodeWallet> {
    return EthersWallet.createRandom(); // Returns HDNodeWallet in Ethers v6
  }

  static async encryptWallet(wallet: HDNodeWallet, password: string): Promise<string> {
    return await wallet.encrypt(password);
  }

 static async decryptWallet(
  encryptedJson: string,
  password: string
): Promise<HDNodeWallet | EthersWallet> {
  return await EthersWallet.fromEncryptedJson(encryptedJson, password);
}

  static validateAddress(address: string): boolean {
    return isAddress(address);
  }

  static formatBalance(balance: string): string {
    const balanceNumber = parseFloat(balance);
    if (balanceNumber === 0) return '0.000000';
    if (balanceNumber < 0.000001) return '< 0.000001';
    return balanceNumber.toFixed(6);
  }

  static shortenAddress(address: string, chars = 4): string {
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
  }

  static async getBalance(address: string): Promise<string> {
    if (!this.validateAddress(address)) {
      throw new Error('Invalid Ethereum address');
    }

    const providers = [
      'https://rpc.sepolia.org',
      'https://eth-sepolia.g.alchemy.com/v2/demo',
      'https://sepolia.gateway.tenderly.co',
      'https://ethereum-sepolia.blockpi.network/v1/rpc/public',
    ];

    const network = { name: 'sepolia', chainId: 11155111 };

    for (const rpcUrl of providers) {
      try {
        const provider = new JsonRpcProvider(rpcUrl, network);
        const balance = await provider.getBalance(address);
        return this.formatBalance(formatEther(balance));
      } catch (error) {
        console.warn(`Failed to fetch balance from ${rpcUrl}:`, error);
      }
    }

    throw new Error('All RPC endpoints failed');
  }
}
