// Environment configuration for Secure Salary Stream
export const config = {
  // Blockchain Configuration
  chainId: 11155111, // Sepolia Testnet
  rpcUrl: 'https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990',
  
  // Wallet Connect Configuration
  walletConnectProjectId: '2ec9743d0d0cd7fb94dee1a7e6d33475',
  
  // Infura Configuration
  infuraApiKey: 'b18fb7e6ca7045ac83c41157ab93f990',
  alternativeRpcUrl: 'https://1rpc.io/sepolia',
  
  // Smart Contract Addresses (to be deployed)
  salaryContractAddress: '',
  fheContractAddress: '',
  
  // App Configuration
  appName: 'Secure Salary Stream',
  appDescription: 'Decentralized payroll management with FHE encryption',
  appUrl: 'https://securesalarystream.com',
} as const;
