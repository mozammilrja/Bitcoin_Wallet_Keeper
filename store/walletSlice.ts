import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CryptoUtils } from '../utils/crypto';
import { ethers } from 'ethers';

export interface WalletInfo {
  address: string;
  encryptedJson: string;
  balance?: string;
  lastUpdated?: string;
}

interface WalletState {
  wallets: WalletInfo[];
  currentWallet: WalletInfo | null;
  privateKey: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WalletState = {
  wallets: [],
  currentWallet: null,
  privateKey: null,
  isLoading: false,
  error: null,
};

// Async thunk for generating a new wallet
export const generateWallet = createAsyncThunk(
  'wallet/generate',
  async (password: string, { rejectWithValue }) => {
    try {
      const wallet = ethers.Wallet.createRandom();
      const encryptedJson = await wallet.encrypt(password);
      
      return {
        address: wallet.address,
        encryptedJson,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue('Failed to generate wallet');
    }
  }
);

// Async thunk for decrypting wallet
export const decryptWallet = createAsyncThunk(
  'wallet/decrypt',
  async ({ encryptedJson, password }: { encryptedJson: string; password: string }, { rejectWithValue }) => {
    try {
      const wallet = await ethers.Wallet.fromEncryptedJson(encryptedJson, password);
      return wallet.privateKey;
    } catch (error) {
      return rejectWithValue('Invalid password');
    }
  }
);

// Async thunk for checking balance
export const checkBalance = createAsyncThunk(
  'wallet/checkBalance',
  async (address: string, { rejectWithValue }) => {
    try {
      return await CryptoUtils.getBalance(address);
    } catch (error) {
      return rejectWithValue('Failed to fetch balance');
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    loadWallets: (state) => {
      if (typeof window !== 'undefined') {
        const savedWallets = localStorage.getItem('wallets');
        if (savedWallets) {
          state.wallets = JSON.parse(savedWallets);
        }
      }
    },
    selectWallet: (state, action: PayloadAction<WalletInfo>) => {
      state.currentWallet = action.payload;
      state.privateKey = null;
    },
    clearPrivateKey: (state) => {
      state.privateKey = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    deleteWallet: (state, action: PayloadAction<string>) => {
      state.wallets = state.wallets.filter(w => w.address !== action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('wallets', JSON.stringify(state.wallets));
      }
      if (state.currentWallet?.address === action.payload) {
        state.currentWallet = null;
        state.privateKey = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate wallet
      .addCase(generateWallet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateWallet.fulfilled, (state, action) => {
        state.isLoading = false;
        const newWallet = action.payload;
        state.wallets.push(newWallet);
        if (typeof window !== 'undefined') {
          localStorage.setItem('wallets', JSON.stringify(state.wallets));
        }
      })
      .addCase(generateWallet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Decrypt wallet
      .addCase(decryptWallet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(decryptWallet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.privateKey = action.payload;
      })
      .addCase(decryptWallet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Check balance
      .addCase(checkBalance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentWallet) {
          state.currentWallet.balance = action.payload;
          state.currentWallet.lastUpdated = new Date().toISOString();
          // Update in wallets array
          const index = state.wallets.findIndex(w => w.address === state.currentWallet?.address);
          if (index !== -1) {
            state.wallets[index] = { ...state.currentWallet };
            if (typeof window !== 'undefined') {
              localStorage.setItem('wallets', JSON.stringify(state.wallets));
            }
          }
        }
      })
      .addCase(checkBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { loadWallets, selectWallet, clearPrivateKey, clearError, deleteWallet } = walletSlice.actions;
export default walletSlice.reducer;