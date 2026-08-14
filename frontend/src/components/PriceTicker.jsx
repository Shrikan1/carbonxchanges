// src/components/PriceTicker.jsx
import { useEffect, useState } from 'react';

const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=polygon-ecosystem-token&vs_currencies=usd&include_24hr_change=true';
const REFRESH_INTERVAL_MS = 30000; 

export default function PriceTicker() {
  const [price, setPrice] = useState(null);
  const [change24h, setChange24h] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch(COINGECKO_URL);
        const data = await res.json();
        setPrice(data['polygon-ecosystem-token'].usd);
        setChange24h(data['polygon-ecosystem-token'].usd_24h_change);
        setError(false);
      } catch {
        setError(true);
      }
    }
    fetchPrice();
    const interval = setInterval(fetchPrice, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  if (error) return <span className="text-sm text-muted-foreground">POL price unavailable</span>;
  if (price === null) return <span className="text-sm text-muted-foreground">Loading price...</span>;

  const isUp = change24h >= 0;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-medium">POL</span>
      <span className="font-mono">${price.toFixed(4)}</span>
      <span className={isUp ? 'text-green-600' : 'text-red-600'}>
        {isUp ? '▲' : '▼'} {Math.abs(change24h).toFixed(2)}%
      </span>
    </div>
  );
}