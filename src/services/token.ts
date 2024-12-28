import { Connection, PublicKey } from '@solana/web3.js';
import { getMint } from '@solana/spl-token';

const HELIUS_RPC_URL = `${process.env.NEXT_PUBLIC_RPC_URL?.toString()}${process.env.NEXT_PUBLIC_HELIUS_API_KEY?.toString()}`;

const connection = new Connection(HELIUS_RPC_URL || '');

export async function getTokenDecimals(mintAddress: string): Promise<number> {
  try {
    const mintPubkey = new PublicKey(mintAddress);
    const mintInfo = await getMint(connection, mintPubkey);
    return mintInfo.decimals;
  } catch (error) {
    console.error('Error fetching token decimals:', error);
    throw new Error('Failed to fetch token decimals');
  }
}
