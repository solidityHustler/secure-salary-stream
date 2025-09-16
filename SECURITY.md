# Security Guidelines

## Environment Variables

This project uses environment variables for configuration. **Never commit sensitive data to version control.**

### Required Environment Variables

Create a `.env.local` file with the following variables:

```env
# Blockchain Configuration
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Wallet Connect Configuration
VITE_WALLET_CONNECT_PROJECT_ID=YOUR_PROJECT_ID

# Infura Configuration
VITE_INFURA_API_KEY=YOUR_INFURA_KEY

# Smart Contract Addresses (after deployment)
VITE_SALARY_CONTRACT_ADDRESS=
VITE_FHE_CONTRACT_ADDRESS=
```

### For Contract Deployment

Create a `.env` file for Hardhat:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## Security Best Practices

1. **Never commit private keys or API keys**
2. **Use environment variables for all sensitive data**
3. **Regularly rotate API keys and private keys**
4. **Use testnet for development and testing**
5. **Audit smart contracts before mainnet deployment**

## Data Privacy

- All salary data is encrypted using FHE (Fully Homomorphic Encryption)
- No sensitive data is stored in plain text
- Employee data remains private even during computation
- Clear data functionality removes all local encrypted data

## Deployment Security

- Use Vercel environment variables for production secrets
- Enable security headers in production
- Use HTTPS for all communications
- Implement proper access controls

## Reporting Security Issues

If you discover a security vulnerability, please report it to:
- Email: security@securesalarystream.com
- Do not open public issues for security vulnerabilities
