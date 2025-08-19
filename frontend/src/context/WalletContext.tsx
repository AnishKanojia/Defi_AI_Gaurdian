import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

declare global {
  interface Window { ethereum?: any }
}

export interface WalletContextValue {
  hasProvider: boolean;
  account: string | null;
  chainId: string | null;
  balanceWei: string | null;
  connect: () => Promise<void>;
  sendTransaction: (to: string, valueEth: string) => Promise<string>;
  refresh: () => Promise<void>;
  subscribeToProtocol: (protocol: string) => Promise<void>;
}

const defaultValue: WalletContextValue = {
  hasProvider: false,
  account: null,
  chainId: null,
  balanceWei: null,
  connect: async () => undefined,
  sendTransaction: async () => '',
  refresh: async () => undefined,
};

const WalletContext = createContext<WalletContextValue>(defaultValue);

export const useWallet = () => useContext(WalletContext);

function toHexWeiFromEth(valueEth: string): string {
  const [whole, fracRaw] = valueEth.split('.');
  const frac = (fracRaw || '').padEnd(18, '0').slice(0, 18);
  const weiStr = BigInt(whole || '0') * 10n ** 18n + BigInt(frac || '0');
  return '0x' + weiStr.toString(16);
}

function selectProvider(): any | null {
  const injected = (window as any).ethereum;
  if (!injected) return null;
  const providers = injected.providers || [];
  const metamask = providers.find((p: any) => p?.isMetaMask);
  return metamask || injected;
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasProvider, setHasProvider] = useState<boolean>(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [balanceWei, setBalanceWei] = useState<string | null>(null);

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
      // Avoid calling addListener due to some injected providers exposing a non-callable value
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
    async connect() {
      const eth = selectProvider();
      if (!eth) throw new Error('No Ethereum provider');
      const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' });
      setAccount(accounts && accounts.length ? accounts[0] : null);
    },
    async sendTransaction(to: string, valueEth: string) {
      const eth = selectProvider();
      if (!eth || !account) throw new Error('Not connected');
      const tx = {
        from: account,
        to,
        value: toHexWeiFromEth(valueEth),
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
  }), [hasProvider, account, chainId, balanceWei]);

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};


