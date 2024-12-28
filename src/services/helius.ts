import { TokenAccountResponse } from '@/lib/types';
import { HeliusAPIError, ValidationError, NoHoldersError, TokenAnalysisError } from '@/lib/errors';
import { SOLANA_ADDRESS_REGEX } from '@/lib/constants';

const HELIUS_RPC_URL = `${process.env.NEXT_PUBLIC_RPC_URL}${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function validateMintAddress(mintAddress: string) {
  if (!mintAddress) {
    throw new ValidationError('Token mint address is required');
  }
  if (!SOLANA_ADDRESS_REGEX.test(mintAddress)) {
    throw new ValidationError('Invalid Solana token mint address format');
  }
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries: number = MAX_RETRIES
): Promise<Response> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      if (retries > 0 && [429, 503].includes(response.status)) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return fetchWithRetry(url, options, retries - 1);
      }
      throw new HeliusAPIError(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    if (
      retries > 0 &&
      error instanceof Error &&
      error.message.includes('fetch')
    ) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw new HeliusAPIError(
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}

export async function getTokenAccounts(
  mintAddress: string
): Promise<TokenAccountResponse> {
  await validateMintAddress(mintAddress);

  let page = 1;
  const allAccounts: TokenAccountResponse['result']['token_accounts'] = [];

  while (true) {
    try {
      const response = await fetchWithRetry(HELIUS_RPC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'getTokenAccounts',
          id: 'helius-test',
          params: {
            page,
            limit: 1000,
            displayOptions: {},
            mint: mintAddress,
          },
        }),
      });

      const data = await response.json();

      // Check for RPC-specific errors
      if (data.error) {
        throw new HeliusAPIError(data.error.message || 'RPC error occurred');
      }

      if (!data.result || !Array.isArray(data.result.token_accounts)) {
        throw new HeliusAPIError('Invalid response format from Helius API');
      }

      if (data.result.token_accounts.length === 0) {
        break;
      }

      allAccounts.push(...data.result.token_accounts);
      page++;

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      if (error instanceof TokenAnalysisError) {
        throw error;
      }
      throw new HeliusAPIError(
        error instanceof Error
          ? error.message
          : 'Failed to fetch token accounts'
      );
    }
  }

  if (allAccounts.length === 0) {
    throw new NoHoldersError();
  }

  return {
    result: {
      token_accounts: allAccounts,
    },
  };
}
