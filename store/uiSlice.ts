import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  activeTab: 'generate' | 'wallets' | 'wallet-detail';
  
  showPrivateKey: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    timestamp: number;
  }>;
}

const initialState: UiState = {
  activeTab: 'generate',
  showPrivateKey: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<UiState['activeTab']>) => {
      state.activeTab = action.payload;
    },
    togglePrivateKey: (state) => {
      state.showPrivateKey = !state.showPrivateKey;
    },
    addNotification: (state, action: PayloadAction<Omit<UiState['notifications'][0], 'id' | 'timestamp'>>) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { setActiveTab, togglePrivateKey, addNotification, removeNotification, clearNotifications } = uiSlice.actions;
export default uiSlice.reducer;