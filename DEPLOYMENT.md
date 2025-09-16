# Vercel Deployment Guide for Secure Salary Stream

This guide provides step-by-step instructions for deploying the Secure Salary Stream application to Vercel.

## Prerequisites

- GitHub account with access to the repository
- Vercel account (free tier available)
- Domain name (optional, for custom domain)

## Step-by-Step Deployment

### 1. Access Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project" on the dashboard

### 2. Import GitHub Repository

1. In the "Import Git Repository" section, find `solidityHustler/secure-salary-stream`
2. Click "Import" next to the repository
3. If the repository is not visible, click "Adjust GitHub App Permissions" and ensure the repository is accessible

### 3. Configure Project Settings

1. **Project Name**: `secure-salary-stream` (or your preferred name)
2. **Framework Preset**: Select "Vite" from the dropdown
3. **Root Directory**: Leave as default (`.`)
4. **Build and Output Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 4. Environment Variables Configuration

Click "Environment Variables" and add the following variables:

```
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
VITE_WALLET_CONNECT_PROJECT_ID=YOUR_PROJECT_ID
VITE_INFURA_API_KEY=YOUR_INFURA_KEY
VITE_SALARY_CONTRACT_ADDRESS=
VITE_FHE_CONTRACT_ADDRESS=
```

**Important**: Replace `YOUR_INFURA_KEY` and `YOUR_PROJECT_ID` with your actual keys.

**Note**: Leave the contract addresses empty initially. You'll update them after deploying the smart contracts.

### 5. Deploy the Application

1. Click "Deploy" button
2. Wait for the build process to complete (usually 2-3 minutes)
3. Once deployed, you'll receive a URL like `https://secure-salary-stream-xxx.vercel.app`

### 6. Configure Custom Domain (Optional)

1. In your Vercel dashboard, go to your project
2. Click on "Settings" tab
3. Navigate to "Domains" section
4. Add your custom domain (e.g., `securesalarystream.com`)
5. Follow the DNS configuration instructions provided by Vercel

### 7. Smart Contract Deployment

Before the application is fully functional, you need to deploy the smart contracts:

1. **Install Hardhat dependencies**:
   ```bash
   npm install @nomicfoundation/hardhat-toolbox hardhat dotenv
   ```

2. **Set up environment variables** (create `.env` file):
   ```
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   PRIVATE_KEY=your_private_key_here
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

3. **Deploy the contract**:
   ```bash
   npm run compile
   npm run deploy
   ```

4. **Update Vercel environment variables** with the deployed contract address:
   - Go to Vercel dashboard → Project Settings → Environment Variables
   - Update `VITE_SALARY_CONTRACT_ADDRESS` with the deployed contract address

5. **Redeploy the application**:
   - Go to Vercel dashboard → Deployments
   - Click "Redeploy" on the latest deployment

## Post-Deployment Configuration

### 1. Verify Deployment

1. Visit your deployed URL
2. Connect a Web3 wallet (MetaMask, Rainbow, etc.)
3. Ensure you're on the Sepolia testnet
4. Test the wallet connection functionality

### 2. Monitor Performance

1. Use Vercel Analytics (available in Pro plan)
2. Monitor build logs for any errors
3. Check browser console for client-side issues

### 3. Security Considerations

1. **Environment Variables**: Never commit private keys or sensitive data
2. **HTTPS**: Vercel automatically provides SSL certificates
3. **Headers**: Security headers are configured in `vercel.json`
4. **Smart Contract**: Ensure proper access controls and FHE implementation

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are properly installed
   - Review build logs in Vercel dashboard

2. **Wallet Connection Issues**:
   - Ensure WalletConnect Project ID is correctly set
   - Verify RPC URL is accessible
   - Check network configuration (Sepolia testnet)

3. **Contract Interaction Issues**:
   - Verify contract address is correctly set
   - Ensure contract is deployed on Sepolia
   - Check contract ABI matches the deployed version

### Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Hardhat Documentation**: [hardhat.org/docs](https://hardhat.org/docs)
- **RainbowKit Documentation**: [rainbowkit.com](https://rainbowkit.com)

## Production Checklist

- [ ] Environment variables configured
- [ ] Smart contracts deployed and verified
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Wallet connection tested
- [ ] Contract interactions tested
- [ ] Performance monitoring enabled
- [ ] Error tracking configured
- [ ] Backup strategy in place

## Maintenance

1. **Regular Updates**: Keep dependencies updated
2. **Security Patches**: Monitor for security vulnerabilities
3. **Performance Monitoring**: Use Vercel Analytics
4. **Backup**: Regular database and contract backups
5. **Documentation**: Keep deployment docs updated

## Cost Considerations

- **Vercel Free Tier**: 100GB bandwidth, 100 serverless function executions
- **Vercel Pro**: $20/month for increased limits
- **Ethereum Gas Fees**: Sepolia testnet is free, mainnet requires ETH
- **Domain**: $10-15/year for custom domain

## Next Steps

1. Deploy smart contracts to mainnet (when ready for production)
2. Implement additional security measures
3. Add comprehensive testing suite
4. Set up CI/CD pipeline
5. Implement monitoring and alerting
6. Create user documentation
7. Plan for scaling and optimization
