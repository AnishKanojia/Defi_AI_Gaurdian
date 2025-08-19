import React from 'react';
import { Button, Popover, Box, Grid, Typography, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import WhatshotOutlinedIcon from '@mui/icons-material/WhatshotOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import NewReleasesOutlinedIcon from '@mui/icons-material/NewReleasesOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import BubbleChartOutlinedIcon from '@mui/icons-material/BubbleChartOutlined';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';
import CurrencyBitcoinOutlinedIcon from '@mui/icons-material/CurrencyBitcoinOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import { useNavigate } from 'react-router-dom';

type MenuItem = { label: string; slug: string; icon: React.ReactNode };
type MenuGroup = { title: string; items: MenuItem[] };

const groups: MenuGroup[] = [
  {
    title: 'Cryptocurrencies',
    items: [
      { label: 'Ranking', slug: 'ranking', icon: <BarChartOutlinedIcon /> },
      { label: 'Categories', slug: 'categories', icon: <CategoryOutlinedIcon /> },
      { label: 'Historical Snapshots', slug: 'historical-snapshots', icon: <HistoryEduOutlinedIcon /> },
      { label: 'Token unlocks', slug: 'token-unlocks', icon: <BoltOutlinedIcon /> },
      { label: 'Yield', slug: 'yield', icon: <PaidOutlinedIcon /> },
      { label: 'Real-World Assets', slug: 'rwa', icon: <PublicOutlinedIcon /> },
    ],
  },
  {
    title: 'Leaderboards',
    items: [
      { label: 'Trending', slug: 'trending', icon: <WhatshotOutlinedIcon /> },
      { label: 'Upcoming', slug: 'upcoming', icon: <UpdateOutlinedIcon /> },
      { label: 'Recently Added', slug: 'recently-added', icon: <NewReleasesOutlinedIcon /> },
      { label: 'Gainers & Losers', slug: 'gainers-losers', icon: <TrendingUpOutlinedIcon /> },
      { label: 'Most Visited', slug: 'most-visited', icon: <VisibilityOutlinedIcon /> },
      { label: 'Community Sentiment', slug: 'community-sentiment', icon: <EmojiEmotionsOutlinedIcon /> },
      { label: 'Chain Ranking', slug: 'chain-ranking', icon: <TimelineOutlinedIcon /> },
    ],
  },
  {
    title: 'Market Overview',
    items: [
      { label: 'Market Overview', slug: 'market-overview', icon: <InsightsOutlinedIcon /> },
      { label: 'CMCap 100 Index', slug: 'cmc-100-index', icon: <PieChartOutlineOutlinedIcon /> },
      { label: 'Fear and Greed Index', slug: 'fear-greed', icon: <EmojiEmotionsOutlinedIcon /> },
      { label: 'Altcoin Season Index', slug: 'altcoin-season', icon: <BubbleChartOutlinedIcon /> },
      { label: 'Bitcoin Dominance', slug: 'btc-dominance', icon: <CurrencyBitcoinOutlinedIcon /> },
      { label: 'Crypto ETFs', slug: 'crypto-etfs', icon: <PieChartOutlineOutlinedIcon /> },
      { label: 'Market Cycle Indicators', slug: 'market-cycle', icon: <TimelineOutlinedIcon /> },
      { label: 'RSI', slug: 'rsi', icon: <TrendingUpOutlinedIcon /> },
    ],
  },
  {
    title: 'Treasuries',
    items: [
      { label: 'Bitcoin Treasuries', slug: 'bitcoin-treasuries', icon: <CurrencyBitcoinOutlinedIcon /> },
    ],
  },
  {
    title: 'NFT',
    items: [
      { label: 'Overall NFT Stats', slug: 'nft-stats', icon: <ImageOutlinedIcon /> },
      { label: 'Upcoming Sales', slug: 'nft-upcoming', icon: <EventOutlinedIcon /> },
    ],
  },
];

const MegaMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  return (
    <>
      <Button color="inherit" onClick={(e)=> setAnchorEl(e.currentTarget)} sx={{ textTransform: 'none', fontWeight: 700 }}>Explore</Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={()=> setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: (t) => ({ p: 2, background: t.palette.background.paper, border: `1px solid ${t.palette.divider}`, maxWidth: 960 }) }}
      >
        <Box sx={{ width: { xs: 320, sm: 720, md: 960 } }}>
          <Grid container spacing={2}>
            {groups.map((group) => (
              <Grid item xs={12} sm={6} md={4} key={group.title}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>{group.title}</Typography>
                <List dense>
                  {group.items.map((it) => (
                    <ListItemButton key={it.slug} onClick={()=> { setAnchorEl(null); navigate(`/feature/${it.slug}`); }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>{it.icon}</ListItemIcon>
                      <ListItemText primary={it.label} />
                    </ListItemButton>
                  ))}
                </List>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Popover>
    </>
  );
};

export default MegaMenu;


