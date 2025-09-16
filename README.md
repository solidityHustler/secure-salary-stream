# Secure Salary Stream

A decentralized payroll management system built with FHE (Fully Homomorphic Encryption) for secure salary processing and blockchain transparency.

## Features

- **FHE-Encrypted Salary Data**: All sensitive salary information is encrypted using Fully Homomorphic Encryption
- **Blockchain Integration**: Transparent and immutable salary records on the blockchain
- **Multi-Wallet Support**: Connect with various Web3 wallets including Rainbow, MetaMask, and more
- **Real-time Dashboard**: Monitor salary streams and payment status
- **Privacy-First Design**: Employee salary data remains encrypted while maintaining auditability

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Wallet Integration**: RainbowKit, Wagmi, Viem
- **Encryption**: FHE (Fully Homomorphic Encryption)
- **Smart Contracts**: Solidity with FHE support

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Web3 wallet (MetaMask, Rainbow, etc.)
- Sepolia ETH for gas fees

### Installation

1. Clone the repository:
```bash
git clone https://github.com/solidityHustler/secure-salary-stream.git
cd secure-salary-stream
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Configure the following environment variables:
```
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Smart Contract

The project includes a Solidity smart contract that implements FHE for secure salary management:

- **Secure Salary Storage**: All salary data is encrypted using FHE
- **Transparent Audit Trail**: Public blockchain records for compliance
- **Privacy-Preserving**: Employee data remains encrypted
- **Automated Payments**: Smart contract-based salary distribution

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

This project uses FHE (Fully Homomorphic Encryption) to ensure that sensitive salary data remains encrypted even during computation. All smart contracts have been audited for security best practices.

## Support

For support, email support@securesalarystream.com or join our Discord community.

## Roadmap

- [ ] Multi-chain support
- [ ] Advanced analytics dashboard
- [ ] Mobile app
- [ ] Integration with traditional payroll systems
- [ ] Compliance reporting tools