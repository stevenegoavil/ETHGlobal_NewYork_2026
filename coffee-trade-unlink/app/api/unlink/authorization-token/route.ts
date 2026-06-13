import { createUnlinkAdmin, createUnlinkAuthRoutes } from '@unlink-xyz/sdk/admin';
import { NextRequest } from 'next/server';

const admin = createUnlinkAdmin({
  environment: 'ethereum-sepolia',
  apiKey: process.env.UNLINK_API_KEY!,
});

const routes = createUnlinkAuthRoutes({
  admin,
  authenticate: async (request: Request) => {
    const body = await request.json();
    return { userId: body.userId };
  },
  onRegister: async ({ session, registration }) => {
    console.log('Registered:', session.userId, registration.address);
  },
  authorizeUnlinkAddress: async ({ session, unlinkAddress }) => true,
});

export async function POST(req: NextRequest) {
  return routes.authorizationToken(req);
}