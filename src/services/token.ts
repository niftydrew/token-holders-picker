const HELIUS_RPC_URL = `${process.env.NEXT_PUBLIC_RPC_URL}${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`;

export async function getTokenDecimals(mintAddress: string): Promise<number> {
  const response = await fetch(HELIUS_RPC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'getTokenSupply',
      id: 'token-metadata',
      params: {
        mint: mintAddress,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch token metadata');
  }

  const data = await response.json();
  console.log('Token metadata:', data);

  if (!data.result?.decimals) {
    throw new Error('Could not get token decimals');
  }

  return data.result.decimals;
}
