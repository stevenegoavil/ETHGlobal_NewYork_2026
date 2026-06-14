# Coffee Trade — Private Commodity Trading on Blockchain

> ETHGlobal New York 2026 | Unlink Prize Track — "Add Privacy to What You're Already Building"

## The Story

I built **Coffee Trade** at my last hackathon (HackMoney 2026) as a commodity trading dapp powered by Yellow Network's state channel SDK. The app got wallet connection and Yellow authentication working, but hit a wall — Yellow's platform is geo-blocked in the US, making it impossible to open a funded channel and complete trades.

This weekend I came back to finish it. I fixed the Yellow SDK auth bug (it now reaches Certified status and generates a valid JWT), then integrated **Dynamic** for multi-wallet authentication and **Unlink** to make every trade fully private on-chain.


---

## What It Does

Coffee Trade is a peer-to-peer commodity marketplace where Ethiopian, Colombian, and Jamaican coffee producers can trade directly with roasters and buyers — with fully private transactions powered by Unlink.

**The problem with traditional on-chain trading:**
Every transaction is public. Anyone can see which wallet bought what, how much they paid, and who the seller is. For commodity traders, this leaks pricing strategy, supplier relationships, and trade volume.

**The solution:**
Unlink shields USDC balances inside a privacy contract. When a buyer purchases coffee, the transfer is unlinked on-chain — the buyer and seller addresses cannot be correlated by any outside observer.

---

## Live Demo Flow

1. Connect wallet via **Dynamic** (MetaMask, WalletConnect, or embedded wallet)
2. Click **Initialize Private Account** — creates your Unlink private address on Ethereum Sepolia
3. Private USDC balance loads from your shielded Unlink account
4. Click **Buy Private** on any coffee listing — triggers a private transfer via Unlink SDK
5. Transaction confirms as **COMPLETE** on Ethereum Sepolia — buyer and seller addresses unlinked on-chain

---

## What I Added This Weekend

| Before (HackMoney 2026) | After (ETHGlobal NYC 2026) |
|---|---|
| MetaMask only | Dynamic SDK — MetaMask, WalletConnect, embedded wallets |
| Yellow Network (geo-blocked) | Unlink SDK — private transfers on Ethereum Sepolia |
| USDC balance always 0 | Real private balance via Unlink |
| Buy button non-functional | Live private transfer confirmed on-chain |
| Yellow auth timing out | Yellow auth fixed — now reaches Certified + JWT |

---

## Tech Stack

- **Next.js 16** — App Router, API routes
- **Dynamic SDK** — wallet authentication and embedded wallets
- **Unlink SDK** (`@unlink-xyz/sdk@canary`) — private USDC transfers on Ethereum Sepolia
- **Tailwind CSS** — styling
- **TypeScript** — throughout

---

## Unlink Integration

### Backend routes (API key secured)
- `POST /api/unlink/register` — registers user's private Unlink account
- `POST /api/unlink/authorization-token` — issues auth token for private operations

### Browser client
```typescript
const { account: unlinkAccount } = await account.fromMetaMask({
  provider: window.ethereum,
  appId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID,
  chainId: 11155111,
});

const client = createUnlinkClient({
  environment: 'ethereum-sepolia',
  account: unlinkAccount,
  userId,
});

await client.ensureRegistered();
```

### Private transfer
```typescript
const tx = await client.transfer({
  recipientAddress: sellerUnlinkAddress,
  token: USDC_TOKEN,
  amount: (price * 1e18).toString(),
});
await tx.wait();
// Transaction unlinked on-chain — buyer and seller cannot be correlated
```

---

## Architecture

User Wallet (MetaMask)

↓

Dynamic SDK (auth + wallet connection)

↓

Next.js App (coffee listings, buy flow)

↓

Unlink SDK /browser

↓

POST /api/unlink/register

POST /api/unlink/authorization-token

↓

Unlink Privacy Contract (Ethereum Sepolia)

↓

Private Transfer — addresses unlinked on-chain

---

## Running Locally

```bash
git clone https://github.com/stevenegoavil/ETHGlobal_NewYork_2026
cd coffee-trade-unlink
npm install
```

Create `.env.local`:
UNLINK_API_KEY=your_unlink_api_key

NEXT_PUBLIC_DYNAMIC_ENV_ID=your_dynamic_env_id


```bash
npm run dev
```

---

## Pre-Event Commit History

The base project (Coffee Trade) was built at HackMoney 2026 and lives at:
`https://github.com/stevenegoavil/hackmoney2026/tree/main/coffee-trade`

This repo contains the full commit history showing the project existed before ETHGlobal NYC 2026, with Unlink integration added during the event.

---

## Links

- **Repo:** https://github.com/stevenegoavil/ETHGlobal_NewYork_2026
- **Original project:** https://github.com/stevenegoavil/hackmoney2026
- **Unlink docs:** https://docs.unlink.xyz
- **Dynamic docs:** https://docs.dynamic.xyz