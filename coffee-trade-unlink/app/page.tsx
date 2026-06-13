'use client';

import { useState } from 'react';
import { DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react-core';

export default function Home() {
  const { primaryWallet, user } = useDynamicContext();
  const [status, setStatus] = useState<string | null>(null);

  const isConnected = !!primaryWallet;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-neutral-50 to-amber-50">
      {/* Navbar */}
      <nav className="border-b border-stone-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">☕</span>
              <h1 className="text-xl font-bold text-amber-900">Coffee Trade</h1>
            </div>
            <DynamicWidget />
          </div>
        </div>
      </nav>

      {/* Status bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm text-sm">
          <span className="font-semibold">Wallet:</span>{' '}
          {isConnected ? primaryWallet.address : 'Not connected'}
          <span className="mx-4 font-semibold">Privacy:</span>{' '}
          <span className="text-amber-700 font-semibold">Unlink SDK</span>
          <span className="mx-4 font-semibold">Network:</span> Base Sepolia
        </div>
      </div>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-stone-800 mb-4">
            Trade Coffee Beans Privately
          </h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Buy and sell commodity coffee with fully private on-chain transactions.
            Powered by Unlink — no one can see your balances or trade history.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-stone-200">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-stone-800 mb-2">Private Balances</h3>
            <p className="text-stone-600">
              Your USDC balance is shielded inside the Unlink contract. Nobody on-chain can see how much you hold.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-stone-200">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-stone-800 mb-2">Instant Settlement</h3>
            <p className="text-stone-600">
              Trades settle immediately on Base Sepolia. No waiting, no intermediaries.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-stone-200">
            <div className="text-3xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold text-stone-800 mb-2">Unlinked Identity</h3>
            <p className="text-stone-600">
              Buyer and seller addresses cannot be linked together on-chain after a private transfer.
            </p>
          </div>
        </div>

        {/* Coffee listings */}
        <h3 className="text-2xl font-bold text-stone-800 mb-6">Available Coffee Listings</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Ethiopian Yirgacheffe', origin: 'Ethiopia', price: '0.50', kg: '10kg' },
            { name: 'Colombian Supremo', origin: 'Colombia', price: '0.45', kg: '25kg' },
            { name: 'Jamaican Blue Mountain', origin: 'Jamaica', price: '1.20', kg: '5kg' },
          ].map((coffee) => (
            <div key={coffee.name} className="bg-white rounded-xl p-6 shadow-lg border border-stone-200">
              <div className="text-3xl mb-3">☕</div>
              <h4 className="text-lg font-semibold text-stone-800">{coffee.name}</h4>
              <p className="text-stone-500 text-sm mb-1">Origin: {coffee.origin}</p>
              <p className="text-stone-500 text-sm mb-4">Quantity: {coffee.kg}</p>
              <div className="flex justify-between items-center">
                <span className="text-amber-700 font-bold">{coffee.price} USDC</span>
                <button
                  disabled={!isConnected}
                  onClick={() => setStatus(`Initiating private purchase of ${coffee.name}...`)}
                  className="bg-amber-700 disabled:bg-stone-300 hover:bg-amber-800 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  {isConnected ? 'Buy Private' : 'Connect Wallet'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {status && (
          <div className="mt-6 bg-white border border-amber-200 rounded-xl p-4 text-amber-800 text-sm">
            {status}
          </div>
        )}
      </main>
    </div>
  );
}