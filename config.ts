// Environment configuration for Secure Salary Stream
export const config = {
  // Blockchain Configuration
  chainId: parseInt(import.meta.env.VITE_CHAIN_ID || '11155111'),
  rpcUrl: import.meta.env.VITE_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
  
  // Wallet Connect Configuration
  walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  
  // Infura Configuration
  infuraApiKey: import.meta.env.VITE_INFURA_API_KEY || 'YOUR_INFURA_KEY',
  alternativeRpcUrl: 'https://1rpc.io/sepolia',
  
  // Smart Contract Addresses (to be deployed)
  salaryContractAddress: import.meta.env.VITE_SALARY_CONTRACT_ADDRESS || '',
  fheContractAddress: import.meta.env.VITE_FHE_CONTRACT_ADDRESS || '',
  
  // App Configuration
  appName: 'Secure Salary Stream',
  appDescription: 'Decentralized payroll management with FHE encryption',
  appUrl: 'https://securesalarystream.com',
} as const;
