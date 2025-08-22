import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

declare global {
  interface Window { ethereum?: any }
}

// BNB Chain configuration
const BNB_CHAIN_CONFIG = {
  chainId: '0x38', // 56 in hex
  chainName: 'BNB Smart Chain',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: ['https://bsc-dataseed1.binance.org/', 'https://bsc-dataseed.binance.org/'],
  blockExplorerUrls: ['https://bscscan.com/'],
};

// Alternative BNB Chain configurations for different RPC endpoints
const BNB_CHAIN_ALTERNATIVES = [
  {
    chainId: '0x38',
    chainName: 'BNB Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed1.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/'],
  },
  {
    chainId: '0x38',
    chainName: 'BNB Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/'],
  },
  {
    chainId: '0x38',
    chainName: 'BNB Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc.nodereal.io/'],
    blockExplorerUrls: ['https://bscscan.com/'],
  }
];

export interface WalletContextValue {
  hasProvider: boolean;
  account: string | null;
  chainId: string | null;
  balanceWei: string | null;
  isCorrectChain: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToBNBChain: () => Promise<void>;
  sendTransaction: (to: string, valueBnb: string) => Promise<string>;
  refresh: () => Promise<void>;
  subscribeToProtocol: (protocol: string) => Promise<void>;
  addBNBChainManually: () => Promise<boolean>;
}

const defaultValue: WalletContextValue = {
  hasProvider: false,
  account: null,
  chainId: null,
  balanceWei: null,
  isCorrectChain: false,
  connect: async () => undefined,
  disconnect: () => undefined,
  switchToBNBChain: async () => undefined,
  sendTransaction: async () => '',
  refresh: async () => undefined,
  subscribeToProtocol: async () => undefined,
  addBNBChainManually: async () => false,
};

const WalletContext = createContext<WalletContextValue>(defaultValue);

export const useWallet = () => useContext(WalletContext);

function toHexWeiFromBnb(valueBnb: string): string {
  const [whole, fracRaw] = valueBnb.split('.');
  const frac = (fracRaw || '').padEnd(18, '0').slice(0, 18);
  const weiStr = BigInt(whole || '0') * 10n ** 18n + BigInt(frac || '0');
  return '0x' + weiStr.toString(16);
}

function selectProvider(): any | null {
  // Check if MetaMask is available
  if (typeof window !== 'undefined' && window.ethereum) {
    // If there are multiple providers, prefer MetaMask
    if (window.ethereum.providers && window.ethereum.providers.length > 0) {
      const metamask = window.ethereum.providers.find((p: any) => p.isMetaMask);
      if (metamask) {
        console.log('Found MetaMask provider');
        return metamask;
      }
    }
    
    // If no providers array or MetaMask not found, check if current ethereum is MetaMask
    if (window.ethereum.isMetaMask) {
      console.log('Using MetaMask provider');
      return window.ethereum;
    }
  }
  
  console.log('No MetaMask provider found');
  return null;
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasProvider, setHasProvider] = useState<boolean>(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [balanceWei, setBalanceWei] = useState<string | null>(null);

  const isCorrectChain = useMemo(() => {
    return chainId === BNB_CHAIN_CONFIG.chainId;
  }, [chainId]);

  useEffect(() => {
    const eth = selectProvider();
    setHasProvider(!!eth);
    if (!eth) return;
    
    const handleAccountsChanged = (accs: string[]) => setAccount(accs && accs.length ? accs[0] : null);
    const handleChainChanged = (cid: string) => setChainId(cid);
    
    eth.request?.({ method: 'eth_accounts' }).then((accs: string[]) => handleAccountsChanged(accs)).catch(() => undefined);
    eth.request?.({ method: 'eth_chainId' }).then((cid: string) => setChainId(cid)).catch(() => undefined);
    
    try {
      if (typeof eth.on === 'function') {
        eth.on('accountsChanged', handleAccountsChanged);
        eth.on('chainChanged', handleChainChanged);
      }
    } catch (_) { /* no-op */ }
    
    return () => {
      eth.removeListener?.('accountsChanged', handleAccountsChanged);
      eth.removeListener?.('chainChanged', handleChainChanged);
      if (typeof eth.removeListener !== 'function' && typeof eth.removeAllListeners === 'function') {
        try { eth.removeAllListeners('accountsChanged'); } catch {}
        try { eth.removeAllListeners('chainChanged'); } catch {}
      }
    };
  }, []);

  useEffect(() => {
    const eth = window.ethereum;
    if (!eth || !account) { setBalanceWei(null); return; }
    eth.request({ method: 'eth_getBalance', params: [account, 'latest'] })
      .then((bal: string) => setBalanceWei(bal))
      .catch(() => setBalanceWei(null));
  }, [account, chainId]);

  const value = useMemo<WalletContextValue>(() => ({
    hasProvider,
    account,
    chainId,
    balanceWei,
    isCorrectChain,
    async connect() {
      const eth = selectProvider();
      if (!eth) throw new Error('No MetaMask provider found');
      
      // Clear any pending requests first
      try {
        await eth.request({ method: 'eth_accounts' });
      } catch (e) {
        console.log('Cleared pending requests');
      }
      
      const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' });
      setAccount(accounts && accounts.length ? accounts[0] : null);
    },
    disconnect() {
      setAccount(null);
      setChainId(null);
      setBalanceWei(null);
      console.log('Wallet disconnected');
    },
    async switchToBNBChain() {
      const eth = selectProvider();
      if (!eth) throw new Error('No MetaMask provider found');
      
      console.log('Attempting to switch to BNB Chain...');
      console.log('Current chainId:', chainId);
      console.log('Target chainId:', BNB_CHAIN_CONFIG.chainId);
      
      // Clear any pending requests first
      try {
        await eth.request({ method: 'eth_chainId' });
      } catch (e) {
        console.log('Cleared pending chain requests');
      }
      
      // Try to switch to existing BNB Chain first
      try {
        console.log('Trying to switch to existing BNB Chain...');
        await eth.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: BNB_CHAIN_CONFIG.chainId }],
        });
        console.log('Successfully switched to BNB Chain');
        return;
      } catch (switchError: any) {
        console.log('Switch error:', switchError);
        
        // Error code 4902 means the chain hasn't been added to MetaMask
        if (switchError.code === 4902) {
          console.log('BNB Chain not found, adding it to MetaMask...');
          
          // Try multiple RPC endpoints
          for (let i = 0; i < BNB_CHAIN_ALTERNATIVES.length; i++) {
            const config = BNB_CHAIN_ALTERNATIVES[i];
            try {
              console.log(`Trying RPC endpoint ${i + 1}:`, config.rpcUrls[0]);
              
              await eth.request({
                method: 'wallet_addEthereumChain',
                params: [config],
              });
              console.log('Successfully added BNB Chain to MetaMask');
              
              // After adding, try to switch
              try {
                await eth.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: BNB_CHAIN_CONFIG.chainId }],
                });
                console.log('Successfully switched to BNB Chain after adding');
                return;
              } catch (finalSwitchError: any) {
                console.log('Final switch error:', finalSwitchError);
                throw new Error(`Failed to switch to BNB Chain: ${finalSwitchError.message}`);
              }
            } catch (addError: any) {
              console.log(`Failed to add BNB Chain with RPC ${i + 1}:`, addError);
              if (i === BNB_CHAIN_ALTERNATIVES.length - 1) {
                // Last attempt failed
                throw new Error(`Failed to add BNB Chain to MetaMask after trying all RPC endpoints: ${addError.message}`);
              }
              // Continue to next RPC endpoint
              continue;
            }
          }
        } else {
          // Other switch errors
          console.log('Other switch error:', switchError);
          throw new Error(`Failed to switch to BNB Chain: ${switchError.message}`);
        }
      }
    },

    async addBNBChainManually() {
      const eth = selectProvider();
      if (!eth) throw new Error('No Ethereum provider');
      
      console.log('Manually adding BNB Chain...');
      
      try {
        await eth.request({
          method: 'wallet_addEthereumChain',
          params: [BNB_CHAIN_CONFIG],
        });
        console.log('Successfully added BNB Chain manually');
        return true;
      } catch (error: any) {
        console.log('Manual add error:', error);
        throw new Error(`Failed to manually add BNB Chain: ${error.message}`);
      }
    },
    async sendTransaction(to: string, valueBnb: string) {
      const eth = selectProvider();
      if (!eth || !account) throw new Error('Not connected');
      if (!isCorrectChain) throw new Error('Please switch to BNB Chain first');
      
      const tx = {
        from: account,
        to,
        value: toHexWeiFromBnb(valueBnb),
        gas: '0x5208', // 21000 gas for basic transfer
      };
      
      const hash: string = await eth.request({ method: 'eth_sendTransaction', params: [tx] });
      return hash;
    },
    async refresh() {
      const eth = selectProvider();
      if (!eth || !account) return;
      const bal: string = await eth.request({ method: 'eth_getBalance', params: [account, 'latest'] });
      setBalanceWei(bal);
    },
    async subscribeToProtocol(protocol: string) {
      if (!account) throw new Error('Connect wallet first');
      await fetch(`/api/security/subscribe?address=${encodeURIComponent(account)}&protocol=${encodeURIComponent(protocol)}`, { method: 'POST' });
    }
  }), [hasProvider, account, chainId, balanceWei, isCorrectChain]);

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};


