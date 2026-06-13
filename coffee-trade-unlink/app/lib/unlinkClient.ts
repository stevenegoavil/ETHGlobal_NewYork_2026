'use client';

import { account, createUnlinkClient, evm } from '@unlink-xyz/sdk/browser';

let clientInstance: any = null;

export async function getUnlinkClient(provider: any, userId: string) {
  if (clientInstance) return clientInstance;

  await provider.request({ method: 'eth_requestAccounts' });

  const evmProvider = evm.fromEip1193({ provider });

  const { account: unlinkAccount } = await account.fromMetaMask({
    provider,
    appId: '3d947bc7-9ad8-475b-a20e-611e72355f5d',
    chainId: 11155111,
  });

  clientInstance = createUnlinkClient({
    environment: 'ethereum-sepolia',
    account: unlinkAccount,
    userId,
    evm: evmProvider,
  });

  await clientInstance.ensureRegistered();
  return clientInstance;
}

export function resetUnlinkClient() {
  clientInstance = null;
}