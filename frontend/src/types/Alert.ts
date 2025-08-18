export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  source: 'ai' | 'monitoring' | 'user' | 'system';
  metadata?: {
    contractAddress?: string;
    transactionHash?: string;
    walletAddress?: string;
    riskScore?: number;
    confidence?: number;
    explanation?: string;
  };
  acknowledged: boolean;
  resolved: boolean;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasUsed: string;
  blockNumber: number;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
  riskScore: number;
  anomalies: string[];
}

export interface SmartContract {
  address: string;
  name: string;
  type: 'token' | 'dex' | 'lending' | 'yield' | 'other';
  riskScore: number;
  vulnerabilities: string[];
  lastAudit: Date;
  tvl: number;
  transactions24h: number;
  status: 'safe' | 'warning' | 'danger';
}

export interface Wallet {
  address: string;
  balance: string;
  riskScore: number;
  suspiciousActivities: string[];
  transactionCount: number;
  lastActivity: Date;
  tags: string[];
}

export interface RiskMetrics {
  totalRiskScore: number;
  highRiskContracts: number;
  suspiciousTransactions: number;
  activeAlerts: number;
  vulnerabilitiesDetected: number;
  lastUpdated: Date;
}

export interface MonitoringStats {
  totalTransactions: number;
  transactionsPerSecond: number;
  averageGasPrice: number;
  activeContracts: number;
  totalValueLocked: number;
  riskScore: number;
}
