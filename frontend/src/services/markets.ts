export interface Market {
  id: string;
  symbol: string;
  name: string;
  image: string;
  market_cap_rank?: number;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
}

export async function fetchTopMarkets(vs: string = 'usd', perPage: number = 50): Promise<Market[]> {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false&price_change_percentage=1h,24h,7d`;
  const res = await fetch(url, { headers: { 'accept': 'application/json' } });
  if (!res.ok) throw new Error(`Failed to fetch markets: ${res.status}`);
  const data = await res.json();
  return data as Market[];
}

export type TickerUpdate = { s: string; p?: string; c?: string; P?: string };

export function subscribeBinanceTickers(symbols: string[], onUpdate: (symbol: string, price: number) => void): () => void {
  if (!symbols.length) return () => undefined;
  const streams = symbols.map(s => `${s.toLowerCase()}@trade`).join('/');
  const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);
  ws.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      const d = payload?.data;
      const sym = d?.s as string | undefined;
      const priceStr = d?.p as string | undefined;
      if (sym && priceStr) {
        const price = parseFloat(priceStr);
        if (!Number.isNaN(price)) onUpdate(sym, price);
      }
    } catch {}
  };
  return () => { try { ws.close(); } catch { /* noop */ } };
}


