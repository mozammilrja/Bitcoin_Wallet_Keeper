# Bitcoin Simple Wallet Keeper

A secure, user-friendly Bitcoin wallet management application built with Next.js and ethers.js. This application allows users to generate, store, and manage Bitcoin wallets with password encryption and testnet balance checking.

## Features

### 🔐 Wallet Generation
- Generate new Bitcoin wallets using ethers.js
- Password-based encryption for private key security
- Random wallet generation with cryptographically secure methods

### 💾 Secure Storage
- Encrypted wallet storage in localStorage
- Never stores plaintext private keys or passwords
- Password-protected access to sensitive data

### 📋 Wallet Management
- List all stored wallets with addresses
- View wallet details including balance and creation date
- Delete wallets with confirmation prompts

### 🔑 Private Key Access
- Secure private key viewing with password authentication
- Copy to clipboard functionality
- Visual security warnings and best practices

### 💰 Balance Checking
- Check wallet balance on Sepolia testnet
- Automatic balance formatting and display
- Last updated timestamps for balance data

### 🧠 State Management
- Redux Toolkit for predictable state management
- Persistent storage with localStorage
- Error handling and loading states

### 🎨 Modern UI
- Clean, responsive design
- Smooth animations and hover effects
- Professional color scheme and typography
- Mobile-first responsive layout

## Technology Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **Blockchain**: ethers.js v6
- **State Management**: Redux Toolkit, React Redux
- **Styling**: Tailwind CSS
- **Testing**: Jest, React Testing Library
- **Build Tool**: Next.js with static export

## Security Features

- ✅ Password-based wallet encryption
- ✅ No plaintext private key storage
- ✅ No password storage
- ✅ Client-side encryption/decryption
- ✅ Visual security warnings
- ✅ Input validation and sanitization

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

### Building for Production

```bash
npm run build
```

## Usage

### Generating a Wallet
1. Navigate to the "Generate Wallet" tab
2. Enter a secure password (minimum 8 characters)
3. Confirm the password
4. Click "Generate Wallet"
5. Your encrypted wallet will be saved locally

### Managing Wallets
1. Go to the "My Wallets" tab to see all saved wallets
2. Click on any wallet to view its details
3. Use the delete button to remove unwanted wallets

### Viewing Private Keys
1. Select a wallet from your wallet list
2. Enter the wallet's password
3. Click "View Private Key"
4. Use the eye icon to show/hide the private key
5. Copy the private key using the copy button

### Checking Balances
1. Select a wallet
2. Click "Refresh" next to the balance section
3. The balance will be fetched from Sepolia testnet

## Project Structure

```
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── Navigation.tsx
│   ├── WalletGenerator.tsx
│   ├── WalletList.tsx
│   ├── WalletDetail.tsx
│   └── Notifications.tsx
├── store/                 # Redux store and slices
│   ├── index.ts
│   ├── walletSlice.ts
│   └── uiSlice.ts
├── utils/                 # Utility functions
│   ├── crypto.ts
│   └── storage.ts
├── __tests__/            # Test files
└── README.md
```

## Security Best Practices

1. **Never share your private keys** - Anyone with access to your private key can control your wallet
2. **Use strong passwords** - Choose passwords with at least 8 characters, including numbers and symbols
3. **Backup your wallets** - Keep secure backups of your encrypted wallet files
4. **Verify addresses** - Always double-check wallet addresses when sending funds
5. **Test with small amounts** - Use testnet for testing before mainnet operations

## Testnet Usage

This application is configured to work with Sepolia testnet. To get test ETH:

1. Copy your wallet address
2. Visit a Sepolia faucet (e.g., faucet.sepolia.org)
3. Request test ETH using your address
4. Refresh your wallet balance in the app

## Development

### Code Organization
- Components are organized by functionality
- Each file maintains single responsibility
- Redux slices handle specific state domains
- Utility functions provide reusable logic

### Adding Features
1. Create new components in `/components`
2. Add state management in appropriate Redux slices
3. Add utility functions in `/utils`
4. Write tests in `/__tests__`

### Testing Strategy
- Unit tests for utility functions
- Integration tests for Redux logic
- Component tests for UI behavior
- Mocked external dependencies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This is educational software for learning purposes. Always use proper security practices and thoroughly test before using with real funds. The developers are not responsible for any loss of funds or security breaches.