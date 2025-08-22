# BNB Chain Setup Guide

## Wallet Configuration

Your wallet is now configured to work with BNB Smart Chain (BSC). Here's what you need to know:

### 1. MetaMask Setup

1. **Install MetaMask** if you haven't already
2. **Add BNB Smart Chain** to MetaMask:
   - Network Name: `BNB Smart Chain`
   - RPC URL: `https://bsc-dataseed1.binance.org/`
   - Chain ID: `56`
   - Currency Symbol: `BNB`
   - Block Explorer: `https://bscscan.com/`

### 2. Getting BNB

To perform transactions, you'll need BNB tokens:
- **Testnet BNB**: Use BSC Testnet faucets for testing
- **Mainnet BNB**: Purchase from exchanges like Binance, or receive from others

### 3. Features Available

✅ **Wallet Connection**: Connect MetaMask to the app
✅ **Chain Switching**: Automatically switch to BNB Chain
✅ **Balance Display**: View your BNB balance in real-time
✅ **Transaction Sending**: Send BNB to other addresses
✅ **Transaction History**: Track your recent transactions
✅ **Dashboard Integration**: Quick wallet access from main dashboard

### 4. Backend Configuration

For real blockchain monitoring, set these environment variables in your backend:

```bash
# BNB Chain RPC URLs
BSC_RPC_URL=https://bsc-dataseed1.binance.org/
BNB_RPC_URL=https://bsc-dataseed1.binance.org/
WEB3_RPC_URL=https://bsc-dataseed1.binance.org/

# WebSocket endpoints for real-time monitoring
BSC_WSS_URL=wss://bsc-ws-node.nariox.org:443
BNB_WSS_URL=wss://bsc-ws-node.nariox.org:443
WEB3_WSS_URL=wss://bsc-ws-node.nariox.org:443

# Network configuration
NETWORK_SYMBOL=BNB
RISK_ALERT_THRESHOLD=70
AUTO_START_MONITORING=true
```

### 5. Security Features

- **Wallet Safety Score**: AI-powered wallet security assessment
- **Real-time Exploit Alerts**: Immediate notifications of detected threats
- **Rug Pull Prediction**: AI analysis of token/project risks
- **Phishing Detection**: Identify malicious DeFi platforms

### 6. Transaction Details

- **Gas Fees**: BNB Chain has very low gas fees (typically < $1)
- **Confirmation Time**: Usually 3-5 seconds
- **Network**: BNB Smart Chain (BSC) - EVM compatible

### 7. Troubleshooting

**Wallet won't connect?**
- Make sure MetaMask is installed and unlocked
- Check if you're on the correct network (BNB Smart Chain)
- Try refreshing the page

**Transaction fails?**
- Ensure you have enough BNB for gas fees
- Verify the recipient address is correct
- Check if you're connected to BNB Smart Chain

**Balance not showing?**
- Click "Refresh Balance" button
- Make sure your wallet is connected
- Check if you're on the correct network

### 8. Demo Mode

Currently running in demo mode for demonstration purposes. Real transactions will be available when:
- Backend is properly configured with BNB Chain RPC URLs
- MetaMask is connected to BNB Smart Chain
- You have BNB tokens in your wallet

---

**Note**: This is a DeFi security monitoring application. Always verify addresses and amounts before sending transactions. Never share your private keys or seed phrases.
