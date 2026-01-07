import { useEffect, useState } from 'react';

// ---------------- Types ----------------
type SwapResult = {
  marketExpected: number;
  idealAmount: number;
  actualAmount: number;
  totalSlippage: number;
  feeSlippage: number;
};

// ---------------- Assets ----------------
import edsLogo from './assets/1.png';
import usdtLogo from './assets/2.png';
import vdepLogo from './assets/3.png';

// ---------------- Config ----------------
const API = 'https://sliswap-loss-visualizer-backend.onrender.com/calculate';

const tokenGlow: Record<string, string> = {
  EDS: '#a855f7',
  USDT: '#22c55e',
  VDEP: '#3b82f6',
};

const tokenIcon: Record<string, string> = {
  EDS: edsLogo,
  USDT: usdtLogo,
  VDEP: vdepLogo,
};

// ---------------- API ----------------
async function fetchSwap(from: string, to: string, amount: number): Promise<SwapResult> {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, amount }),
  });
  return res.json();
}

// ---------------- App ----------------
export default function App() {
  return (
    <div style={pageStyle}>
      <div style={mainCardStyle}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          SliSwap Loss Visualizer
        </h1>

        <Section token="EDS">
          <SwapCard from="EDS" to="USDT" />
          <SwapCard from="EDS" to="VDEP" />
        </Section>

        <Section token="USDT">
          <SwapCard from="USDT" to="EDS" />
          <SwapCard from="USDT" to="VDEP" />
        </Section>

        <Section token="VDEP">
          <SwapCard from="VDEP" to="EDS" />
          <SwapCard from="VDEP" to="USDT" />
        </Section>
      </div>
    </div>
  );
}

// ---------------- Components ----------------
function Section({ token, children }: { token: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        marginBottom: '2.5rem',
        padding: '2rem',
        borderRadius: 28,
        border: `3px solid ${tokenGlow[token]}`,
        boxShadow: `0 0 30px ${tokenGlow[token]}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <img src={tokenIcon[token]} width={48} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
        {children}
      </div>
    </div>
  );
}

function SwapCard({ from, to }: { from: string; to: string }) {
  const [amount, setAmount] = useState('1');
  const [result, setResult] = useState<SwapResult | null>(null);

  useEffect(() => {
    const n = Number(amount);
    if (n > 0) {
      fetchSwap(from, to, n).then(setResult);
    } else {
      setResult(null);
    }
  }, [amount, from, to]);

  return (
    <div style={cardStyle}>
      <b>{from} → {to}</b>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={inputStyle}
      />

      {result && (
        <div style={{ fontSize: '0.8rem', marginTop: 8 }}>
          <div>Market Expected: {result.marketExpected.toFixed(6)} {to}</div>
          <div>Ideal: {result.idealAmount.toFixed(6)} {to}</div>
          <div>Actual: {result.actualAmount.toFixed(6)} {to}</div>
          <div>Loss: {(result.marketExpected - result.actualAmount).toFixed(6)} {to}</div>
          <div>Total Slippage: {result.totalSlippage.toFixed(4)}%</div>
          <div>Fee Slippage: {result.feeSlippage.toFixed(4)}%</div>
        </div>
      )}
    </div>
  );
}

// ---------------- Styles ----------------
const cardStyle = {
  background: '#ffffff',
  padding: '1rem',
  borderRadius: 16,
  minWidth: 230,
  textAlign: 'center' as const,
};

const inputStyle = {
  width: '100%',
  marginTop: 8,
  padding: '0.4rem',
  borderRadius: 8,
  border: '1px solid #ccc',
  textAlign: 'center' as const,
};

const pageStyle = {
  width: '100vw',
  minHeight: '100vh',
  background: 'linear-gradient(135deg,#2a0b52,#1b0b3a)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const mainCardStyle = {
  width: '100%',
  maxWidth: 900,
  padding: '2.5rem',
  borderRadius: 40,
  background: '#4b2b78',
  boxShadow: '0 0 80px #a855f7',
};
