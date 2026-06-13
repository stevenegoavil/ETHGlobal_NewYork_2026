'use client';

import { account, createUnlinkClient } from '@unlink-xyz/sdk/browser';

let clientInstance: any = null;
let storedProvider: any = null;

export async function getUnlinkClient(provider: any, userId: string) {
  storedProvider = provider;
  if (clientInstance) return clientInstance;

  const { account: unlinkAccount } = await account.fromMetaMask({
    provider,
    appId: '3d947bc7-9ad8-475b-a20e-611e72355f5d',
    chainId: 11155111,
  });

  clientInstance = createUnlinkClient({
    environment: 'ethereum-sepolia',
    account: unlinkAccount,
    userId,
    evmProvider: provider,
  });

  await clientInstance.ensureRegistered();
  console.log('Unlink client methods:', Object.keys(clientInstance));
  return clientInstance;
}

export function resetUnlinkClient() {
  clientInstance = null;
  storedProvider = null;
}