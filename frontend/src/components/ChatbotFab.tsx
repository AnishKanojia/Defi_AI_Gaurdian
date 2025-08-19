import React, { useEffect, useRef, useState } from 'react';
import { Box, Fab, Paper, Typography, IconButton, TextField, Button, useTheme } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';

async function fetchJSON(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchTopMarketsClient(vs: string = 'usd', perPage: number = 100) {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false&price_change_percentage=1h,24h,7d`;
  return fetchJSON(url);
}

const ChatbotFab: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: 'Hi! I am your AI advisor. Ask about: "portfolio suggestions", token price (e.g., "price of ETH"), or "top gainers".' }
  ]);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');

    try {
      const q = text.toLowerCase();

      // Portfolio suggestions (default to medium if none specified)
      if (/portfolio|alloc|suggest/i.test(q)) {
        const risk = /high/i.test(q) ? 'high' : /low/i.test(q) ? 'low' : 'medium';
        const res = await fetch('/api/ai/investment-suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ risk })
        });
        const data = await res.json();
        const lines = (data.suggestions || []).map((s: any) => `- ${s.asset}: ${s.allocation}% (${s.reason})`).join('\n');
        setMessages((m) => [...m, { role: 'assistant', text: lines || 'I suggest a balanced mix of BTC/ETH/DeFi.' }]);
        return;
      }

      // Price queries: "price of BTC" or "BTC price"
      if (/price/.test(q)) {
        const tokenMatch = q.match(/price(?:\s+of)?\s+([a-z0-9\-]+)/i) || q.match(/([a-z0-9\-]+)\s+price/i);
        const token = tokenMatch?.[1]?.replace(/[^a-z0-9\-]/gi, '') || '';
        const markets = await fetchTopMarketsClient('usd', 150);
        const found = markets.find((m: any) => m.symbol?.toLowerCase() === token || m.name?.toLowerCase() === token) ||
                      markets.find((m: any) => m.symbol?.toLowerCase() === token.slice(0, 4));
        if (found) {
          const reply = `${found.name} (${found.symbol.toUpperCase()}): $${(found.current_price || 0).toLocaleString()} (24h ${Number(found.price_change_percentage_24h_in_currency || 0).toFixed(2)}%)`;
          setMessages((m) => [...m, { role: 'assistant', text: reply }]);
        } else {
          setMessages((m) => [...m, { role: 'assistant', text: `I couldn't find ${token}. Try a known symbol like BTC or ETH.` }]);
        }
        return;
      }

      // Top gainers
      if (/top\s+(gainer|mover|pump)/.test(q)) {
        const markets = await fetchTopMarketsClient('usd', 150);
        const tops = markets
          .filter((m: any) => typeof m.price_change_percentage_24h_in_currency === 'number')
          .sort((a: any, b: any) => b.price_change_percentage_24h_in_currency - a.price_change_percentage_24h_in_currency)
          .slice(0, 5);
        const lines = tops.map((m: any, i: number) => `${i + 1}. ${m.name} (${m.symbol.toUpperCase()}): ${m.price_change_percentage_24h_in_currency.toFixed(2)}%`).join('\n');
        setMessages((m) => [...m, { role: 'assistant', text: lines || 'No movers available right now.' }]);
        return;
      }

      // General fallback: provide help + medium risk suggestions
      const res = await fetch('/api/ai/investment-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ risk: 'medium' })
      });
      const data = await res.json();
      const lines = (data.suggestions || []).map((s: any) => `- ${s.asset}: ${s.allocation}% (${s.reason})`).join('\n');
      const help = `I can help with:\n• Portfolio suggestions (e.g., "portfolio suggestions high")\n• Token prices ("price of ETH")\n• Top gainers ("top gainers today")`;
      setMessages((m) => [...m, { role: 'assistant', text: `${help}\n\nHere is a balanced draft:\n${lines}` }]);
    } catch (e: any) {
      setMessages((m) => [...m, { role: 'assistant', text: 'Sorry, I had trouble processing that. Please try again.' }]);
    }
  };

  return (
    <>
      <Fab 
        color="primary" 
        aria-label="chat" 
        onClick={() => setOpen((o) => !o)} 
        sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24, 
          zIndex: 1500,
          background: 'linear-gradient(135deg, #6366f1 0%, #10b981 100%)',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
          width: 64,
          height: 64,
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #059669 100%)',
            boxShadow: '0 12px 40px rgba(99, 102, 241, 0.5)',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <ChatIcon sx={{ fontSize: 28, color: 'white' }} />
      </Fab>
      
      {open && (
        <Paper 
          sx={{ 
            position: 'fixed', 
            bottom: 96, 
            right: 24, 
            width: 380, 
            height: 480, 
            display: 'flex', 
            flexDirection: 'column',
            background: theme.palette.mode === 'dark' 
              ? 'rgba(30, 41, 59, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)',
            border: `1px solid ${theme.palette.mode === 'dark' 
              ? 'rgba(99, 102, 241, 0.3)' 
              : 'rgba(99, 102, 241, 0.2)'}`,
            borderRadius: '20px',
            backdropFilter: 'blur(20px)',
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.2)'
              : '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(99, 102, 241, 0.1)',
            zIndex: 1500,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box 
            sx={{ 
              p: 2, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #6366f1 0%, #10b981 100%)',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <SmartToyIcon sx={{ fontSize: 24 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                AI Advisor
              </Typography>
            </Box>
            <IconButton 
              size="small" 
              onClick={() => setOpen(false)}
              sx={{ 
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          
          {/* Messages */}
          <Box 
            ref={boxRef} 
            sx={{ 
              px: 2, 
              py: 1.5, 
              flexGrow: 1, 
              overflowY: 'auto',
              background: theme.palette.mode === 'dark' 
                ? 'rgba(15, 23, 42, 0.3)' 
                : 'rgba(248, 250, 252, 0.5)',
            }}
          >
            {messages.map((m, i) => (
              <Box key={i} sx={{ my: 1.5, display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <Box 
                  sx={{ 
                    bgcolor: m.role === 'user' 
                      ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                      : theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(255, 255, 255, 0.9)',
                    color: m.role === 'user' ? 'white' : theme.palette.text.primary,
                    border: `1px solid ${m.role === 'user' 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : theme.palette.mode === 'dark' 
                        ? 'rgba(99, 102, 241, 0.2)' 
                        : 'rgba(99, 102, 241, 0.1)'}`,
                    px: 2, 
                    py: 1.5, 
                    borderRadius: '16px',
                    maxWidth: '85%',
                    boxShadow: m.role === 'user' 
                      ? '0 4px 12px rgba(99, 102, 241, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Typography 
                    variant="body2" 
                    whiteSpace="pre-wrap"
                    sx={{ 
                      fontWeight: m.role === 'user' ? 600 : 500,
                      lineHeight: 1.5,
                    }}
                  >
                    {m.text}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
          
          {/* Input */}
          <Box sx={{ p: 2, background: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)' }}>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <TextField 
                fullWidth 
                size="medium" 
                placeholder="Ask anything..." 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: theme.palette.background.paper,
                  },
                }}
              />
              <Button 
                variant="contained" 
                onClick={send}
                sx={{
                  borderRadius: '12px',
                  px: 2,
                  minWidth: 'auto',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                <SendIcon />
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default ChatbotFab;


