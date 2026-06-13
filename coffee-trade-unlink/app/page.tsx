'use client';

import { useState } from 'react';
import { DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { getUnlinkClient } from './lib/unlinkClient';

declare global {
  interface Window {
    ethereum: any;
  }
}

const SELLER_UNLINK_ADDRESS = 'unlink1qqfy4lav3t0f9uk5z7t6vjn2qrtyfm6gfncxu4tv3d3s56ns2vzelmtjwce7f99ynjc4a8wunafpeuv4ueh0z39au8k6d806h853x9rjcfzc8j';
const USDC_TOKEN = '0xd9e515b65caa28f99581632d0cf78d62e7d3a2fd'; // Sepolia USDC

export default function Home() {
  const { primaryWallet, user } = useDynamicContext();
  const [status, setStatus] = useState<string | null>(null);
  const [unlinkAddress, setUnlinkAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isConnected = !!primaryWallet;

  const initUnlink = async () => {
    if (!primaryWallet || !user) return;
    try {
      setLoading(true);
      setStatus('Initializing private account...');
      const client = await getUnlinkClient(window.ethereum, primaryWallet.address);
      const { balances } = await client.getBalances();
      const usdc = balances.find((b: any) => b.token === USDC_TOKEN);
      setBalance(usdc ? (Number(usdc.amount) / 1e18).toFixed(2) : '0.00');
      setUnlinkAddress(client.address ?? primaryWallet.address);
      setStatus('Private account ready.');
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const buyPrivate = async (coffeeName: string, amount: string) => {
    if (!primaryWallet || !user) return;
    try {
      setLoading(true);
      setStatus(`Initiating private purchase of ${coffeeName}...`);
      const client = await getUnlinkClient(window.ethereum, primaryWallet.address);
      const tx = await client.transfer({
        recipientAddress: SELLER_UNLINK_ADDRESS,
        token: USDC_TOKEN,
        amount: (parseFloat(amount) * 1e6).toString(),
      });
      await tx.wait();
      setStatus(`✅ Private purchase of ${coffeeName} complete. Transaction unlinked on-chain.`);
      const { balances } = await client.getBalances();
      const usdc = balances.find((b: any) => b.token === USDC_TOKEN);
      setBalance(usdc ? (Number(usdc.amount) / 1e18).toFixed(2) : '0.00');
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-neutral-50 to-amber-50">
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
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm text-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 text-stone-800">
            <span><span className="font-semibold">Wallet:</span> {isConnected ? `${primaryWallet.address.slice(0,6)}...${primaryWallet.address.slice(-4)}` : 'Not connected'}</span>
            <span><span className="font-semibold">Privacy:</span> <span className="text-amber-700 font-semibold">Unlink SDK</span></span>
            <span><span className="font-semibold">Network:</span> Base Sepolia</span>
            {unlinkAddress && <span><span className="font-semibold">Unlink:</span> {unlinkAddress.slice(0,12)}...</span>}
            {balance && <span><span className="font-semibold">Private USDC:</span> {balance}</span>}
          </div>

      {isConnected && !unlinkAddress && (
        <button
          onClick={initUnlink}
          disabled={loading}
          className="bg-amber-700 hover:bg-amber-800 disabled:bg-stone-300 text-white font-semibold px-4 py-2 rounded-lg text-sm"
        >
          {loading ? 'Initializing...' : 'Initialize Private Account'}
        </button>
      )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-stone-800 mb-4">Trade Coffee Beans Privately</h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Buy and sell commodity coffee with fully private on-chain transactions.
            Powered by Unlink — no one can see your balances or trade history.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-stone-200">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-stone-800 mb-2">Private Balances</h3>
            <p className="text-stone-600">Your USDC balance is shielded inside the Unlink contract. Nobody on-chain can see how much you hold.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-stone-200">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-stone-800 mb-2">Instant Settlement</h3>
            <p className="text-stone-600">Trades settle immediately on Base Sepolia. No waiting, no intermediaries.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-stone-200">
            <div className="text-3xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold text-stone-800 mb-2">Unlinked Identity</h3>
            <p className="text-stone-600">Buyer and seller addresses cannot be linked together on-chain after a private transfer.</p>
          </div>
        </div>

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
                  disabled={!isConnected || !unlinkAddress || loading}
                  onClick={() => buyPrivate(coffee.name, coffee.price)}
                  className="bg-amber-700 disabled:bg-stone-300 hover:bg-amber-800 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  {!isConnected ? 'Connect Wallet' : !unlinkAddress ? 'Init Account' : loading ? 'Processing...' : 'Buy Private'}
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