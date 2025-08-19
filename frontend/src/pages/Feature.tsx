import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Chip, Card, CardContent } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { LineChart, PieChart } from '@mui/x-charts';
import { Box as MuiBox } from '@mui/material';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Paper sx={(t)=>({ p:2, border:`1px solid ${t.palette.divider}`, background: t.palette.background.paper, mb: 2 })}>
    <Typography variant="h6" sx={{ mb: 1 }}>{title}</Typography>
    {children}
  </Paper>
);

const useMockSeries = (len = 60, base = 100, noise = 10) => {
  return useMemo(() => {
    const now = Date.now();
    const step = 60 * 60 * 1000;
    const x: number[] = [];
    const y: number[] = [];
    for (let i = len - 1; i >= 0; i--) {
      x.push(now - i * step);
      const last = y.length ? y[y.length - 1] : base;
      y.push(Math.max(0, last + (Math.random() - 0.5) * noise));
    }
    return { x, y };
  }, [len, base, noise]);
};

const RankingTable: React.FC = () => {
  const rows = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    rank: i + 1,
    name: `Token ${i + 1}`,
    price: +(Math.random() * 1000).toFixed(2),
    change24h: +(Math.random() * 20 - 10).toFixed(2),
    marketCap: +(Math.random() * 1e9).toFixed(0),
  }));
  const cols: GridColDef[] = [
    { field: 'rank', headerName: '#', width: 70 },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 160 },
    { field: 'price', headerName: 'Price', width: 120, valueFormatter: (p)=> `$${p.value}` },
    { field: 'change24h', headerName: '24h %', width: 100, valueFormatter: (p)=> `${p.value}%` },
    { field: 'marketCap', headerName: 'Market Cap', width: 160, valueFormatter: (p)=> `$${Number(p.value).toLocaleString()}` },
  ];
  return <div style={{ height: 520, width: '100%' }}><DataGrid rows={rows} columns={cols} disableRowSelectionOnClick /></div>;
};

const Categories: React.FC = () => (
  <Grid container spacing={1}>
    {['DeFi','Gaming','NFT','Lending','DEX','RWA','AI','Memes','Infrastructure'].map((c) => (
      <Grid item key={c}><Chip label={`${c} • ${Math.floor(Math.random()*500)+20}`} /></Grid>
    ))}
  </Grid>
);

const TokenUnlocks: React.FC = () => {
  const rows = Array.from({ length: 15 }, (_, i) => ({ id: i, project: `Project ${i+1}`, amount: (Math.random()*10).toFixed(2)+'M', date: new Date(Date.now()+i*86400000).toLocaleDateString() }));
  const cols: GridColDef[] = [
    { field: 'project', headerName: 'Project', flex: 1, minWidth: 160 },
    { field: 'amount', headerName: 'Amount', width: 140 },
    { field: 'date', headerName: 'Date', width: 140 },
  ];
  return <div style={{ height: 420, width: '100%' }}><DataGrid rows={rows} columns={cols} hideFooterSelectedRowCount /></div>;
};

const YieldTable: React.FC = () => {
  const rows = Array.from({ length: 12 }, (_, i) => ({ id: i, pool: `Pool ${i+1}`, chain: ['BNB','ETH','ARB','OP'][i%4], apy: +(Math.random()*35+1).toFixed(2)+'%' }));
  const cols: GridColDef[] = [
    { field: 'pool', headerName: 'Pool', flex: 1 },
    { field: 'chain', headerName: 'Chain', width: 120 },
    { field: 'apy', headerName: 'APY', width: 120 },
  ];
  return <div style={{ height: 380, width: '100%' }}><DataGrid rows={rows} columns={cols} /></div>;
};

const KPI: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Card>
    <CardContent>
      <Typography variant="overline">{label}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
    </CardContent>
  </Card>
);

const FeaturePage: React.FC = () => {
  const { slug } = useParams();
  const series = useMockSeries(72, 100, 8);
  const series2 = useMockSeries(72, 50, 5);

  const title = (slug || '').replace(/-/g, ' ');

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>{title}</Typography>

      {/* Switch on slug to render relevant components */}
      {slug === 'ranking' && (
        <Section title="Top Tokens by Market Cap">
          <RankingTable />
        </Section>
      )}

      {slug === 'categories' && (
        <Section title="Categories">
          <Categories />
        </Section>
      )}

      {slug === 'historical-snapshots' && (
        <>
          <Section title="Total Market Cap (30d)">
            <LineChart xAxis={[{ data: series.x, scaleType: 'time' }]} series={[{ data: series.y, label: 'Market Cap' }]} height={300} />
          </Section>
          <Section title="BTC Dominance (30d)">
            <LineChart xAxis={[{ data: series2.x, scaleType: 'time' }]} series={[{ data: series2.y, label: 'BTC.D', color: '#f6a807' }]} height={300} />
          </Section>
        </>
      )}

      {slug === 'token-unlocks' && (
        <Section title="Upcoming Token Unlocks">
          <TokenUnlocks />
        </Section>
      )}

      {slug === 'yield' && (
        <Section title="Yield Opportunities">
          <YieldTable />
        </Section>
      )}

      {slug === 'rwa' && (
        <Section title="Real-World Assets Overview">
          <Grid container spacing={2}>
            {['Treasury Bills','Real Estate','Commodities','Private Credit'].map((label, i)=> (
              <Grid item xs={12} sm={6} md={3} key={label}><KPI label={label} value={`$${(Math.random()*5+1).toFixed(1)}B`} /></Grid>
            ))}
          </Grid>
        </Section>
      )}

      {['trending','upcoming','recently-added','gainers-losers','most-visited','community-sentiment','chain-ranking'].includes(slug || '') && (
        <Section title="List">
          <RankingTable />
        </Section>
      )}

      {slug === 'market-overview' && (
        <>
          <Section title="Total Market Cap">
            <LineChart xAxis={[{ data: series.x, scaleType: 'time' }]} series={[{ data: series.y, label: 'Total Cap' }]} height={300} />
          </Section>
          <Section title="Volume Share">
            <PieChart series={[{ data: [ { id:0, value:40, label:'BTC' },{ id:1, value:35, label:'ETH' },{ id:2, value:25, label:'Altcoins' } ] }]} height={260} />
          </Section>
        </>
      )}

      {slug === 'cmc-100-index' && (
        <Section title="CMC 100 Index (mock)">
          <LineChart xAxis={[{ data: series.x, scaleType: 'time' }]} series={[{ data: series.y, label: 'Index' }]} height={300} />
        </Section>
      )}

      {slug === 'fear-greed' && (
        <Section title="Fear & Greed">
          <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>{Math.round(Math.random()*100)}</Typography>
            <Typography variant="body2" color="text.secondary">Index (mock)</Typography>
          </MuiBox>
        </Section>
      )}

      {slug === 'altcoin-season' && (
        <Section title="Altcoin Season Index">
          <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>{60 + Math.round(Math.random()*40)}</Typography>
            <Typography variant="body2" color="text.secondary">Season (mock)</Typography>
          </MuiBox>
        </Section>
      )}

      {slug === 'btc-dominance' && (
        <Section title="BTC Dominance">
          <LineChart xAxis={[{ data: series2.x, scaleType: 'time' }]} series={[{ data: series2.y, label: 'BTC.D', color: '#f6a807' }]} height={300} />
        </Section>
      )}

      {slug === 'crypto-etfs' && (
        <Section title="Crypto ETFs">
          <Grid container spacing={2}>
            {['IBIT','FBTC','ARKB','BTCW','BTCO'].map((s)=> (
              <Grid item key={s}><Chip label={`${s} • ${(Math.random()*10).toFixed(1)}B AUM`} /></Grid>
            ))}
          </Grid>
        </Section>
      )}

      {slug === 'market-cycle' && (
        <>
          <Section title="Price vs. Realized Cap">
            <LineChart xAxis={[{ data: series.x, scaleType: 'time' }]} series={[{ data: series.y, label: 'Price' }, { data: series2.y, label: 'Realized Cap' }]} height={300} />
          </Section>
          <Section title="MVRV (mock)">
            <LineChart xAxis={[{ data: series.x, scaleType: 'time' }]} series={[{ data: series.y.map((v, i)=> +(v/50 + (i%5)).toFixed(2)), label: 'MVRV' }]} height={300} />
          </Section>
        </>
      )}

      {slug === 'rsi' && (
        <Section title="RSI (mock)">
          <LineChart xAxis={[{ data: series.x, scaleType: 'time' }]} series={[{ data: series.y.map((v)=> Math.max(0, Math.min(100, (v%100)))), label: 'RSI' }]} height={300} />
        </Section>
      )}

      {slug === 'bitcoin-treasuries' && (
        <Section title="Bitcoin Treasuries">
          <Grid container spacing={2}>
            {['MicroStrategy','Tesla','Marathon','Hut8'].map((c)=> (
              <Grid item xs={12} sm={6} md={3} key={c}><KPI label={c} value={`${(Math.random()*200)+10 | 0}k BTC`} /></Grid>
            ))}
          </Grid>
        </Section>
      )}

      {slug === 'nft-stats' && (
        <Section title="Overall NFT Stats">
          <Grid container spacing={2}>
            {['Sales (24h)','Volume (24h)','Avg Price','Active Collections'].map((k)=> (
              <Grid item xs={12} sm={6} md={3} key={k}><KPI label={k} value={`${(Math.random()*100).toFixed(1)}k`} /></Grid>
            ))}
          </Grid>
        </Section>
      )}

      {slug === 'nft-upcoming' && (
        <Section title="Upcoming Sales">
          <TokenUnlocks />
        </Section>
      )}

      {/* Fallback generic content */}
      {!(slug && [
        'ranking','categories','historical-snapshots','token-unlocks','yield','rwa',
        'trending','upcoming','recently-added','gainers-losers','most-visited','community-sentiment','chain-ranking',
        'market-overview','cmc-100-index','fear-greed','altcoin-season','btc-dominance','crypto-etfs','market-cycle','rsi',
        'bitcoin-treasuries','nft-stats','nft-upcoming',
      ].includes(slug)) && (
        <Section title="Coming soon">
          <Typography variant="body2">This page will be wired to real data later.</Typography>
        </Section>
      )}
    </Box>
  );
};

export default FeaturePage;


