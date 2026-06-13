'use client';

//import '@rainbow-me/rainbowkit/styles.css';
//import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
//import { mainnet, polygon, polygonAmoy } from 'wagmi/chains';
//import { WagmiProvider } from 'wagmi';

import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';

//const config = getDefaultConfig({
//  appName: 'Coffee Trade - Yellow Network',
//  projectId: 'f2cb8ca61a6611846abf4663d01f3509', // Get this from cloud.walletconnect.com
//  chains: [mainnet, polygon, polygonAmoy],
//  ssr: true,
//});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
        <QueryClientProvider client={queryClient}>
      <DynamicContextProvider
        settings={{
          environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID!,
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        {children}
      </DynamicContextProvider>
    </QueryClientProvider>

    //<WagmiProvider config={config}>
    //  <QueryClientProvider client={queryClient}>
    //    <RainbowKitProvider>
     //     {children}
     //   </RainbowKitProvider>
     // </QueryClientProvider>
    //</WagmiProvider>
  );
}