import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useWallet } from '../context/WalletContext.tsx';

function formatEth(weiHex: string | null): string {
  if (!weiHex) return '0';
  const wei = BigInt(weiHex);
  const ethInt = wei / (10n ** 18n);
  const frac = (wei % (10n ** 18n)).toString().padStart(18, '0').slice(0, 4);
  return `${ethInt.toString()}.${frac}`;
}

const WalletPage: React.FC = () => {
  const { hasProvider, account, chainId, balanceWei, connect, sendTransaction, refresh } = useWallet();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [txs, setTxs] = useState<{ hash: string; to: string; value: string; time: string }[]>([]);

  const chain = useMemo(() => chainId ? parseInt(chainId, 16) : null, [chainId]);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Wallet</Typography>
      <Paper sx={(t) => ({ p: 2, background: t.palette.background.paper, border: `1px solid ${t.palette.divider}` })}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="subtitle2">Status</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Provider: {hasProvider ? 'Detected' : 'Not found'} | Chain: {chain ?? '-'} | Account: {account ?? '-'} | Balance: {formatEth(balanceWei)}
            </Typography>
            {!account ? (
              <Button variant="contained" onClick={connect} disabled={!hasProvider}>Connect MetaMask</Button>
            ) : (
              <Button variant="outlined" onClick={refresh}>Refresh Balance</Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={(t) => ({ p: 2, mt: 2, background: t.palette.background.paper, border: `1px solid ${t.palette.divider}` })}>
        <Typography variant="h6" sx={{ mb: 1 }}>Send Transaction</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}><TextField fullWidth size="small" label="To" placeholder="0x..." value={to} onChange={(e)=>setTo(e.target.value)} /></Grid>
          <Grid item xs={12} md={3}><TextField fullWidth size="small" label="Amount (ETH)" value={amount} onChange={(e)=>setAmount(e.target.value)} /></Grid>
          <Grid item xs={12} md={2}><Button variant="contained" disabled={!account || !to || !amount} onClick={async ()=>{ const hash = await sendTransaction(to, amount); setTxs(prev=>[{ hash, to, value: amount, time: new Date().toLocaleTimeString() }, ...prev]); }}>Send</Button></Grid>
        </Grid>
      </Paper>

      <Paper sx={(t) => ({ p: 2, mt: 2, background: t.palette.background.paper, border: `1px solid ${t.palette.divider}` })}>
        <Typography variant="h6" sx={{ mb: 1 }}>Recent Transactions (session)</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Hash</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Value (ETH)</TableCell>
                <TableCell>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {txs.map((t) => (
                <TableRow key={t.hash}>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{t.hash.slice(0,10)}…</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{t.to}</TableCell>
                  <TableCell>{t.value}</TableCell>
                  <TableCell>{t.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default WalletPage;


