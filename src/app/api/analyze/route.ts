import { NextResponse } from 'next/server';
import { getTokenAccounts } from '@/services/helius';
import { getTokenDecimals } from '@/services/token';
import { processTokenAccounts } from '@/services/analysis';
import {
  TokenAnalysisError,
  ValidationError,
  NoHoldersError,
} from '@/lib/errors';

export async function POST(request: Request) {
  const startTime = performance.now();

  try {
    const body = await request.json();
    console.log('Received request body:', body);

    const { mintAddress, minHoldings, numberOfHolders, excludeTopPercent } =
      body;

    // Validate input parameters
    if (!mintAddress) {
      throw new ValidationError('Contract address is required');
    }

    if (minHoldings < 0) {
      throw new ValidationError('Minimum holdings must be positive');
    }

    if (numberOfHolders < 1) {
      throw new ValidationError('Number of holders must be at least 1');
    }

    if (excludeTopPercent < 0 || excludeTopPercent >= 100) {
      throw new ValidationError(
        'Exclude top percentage must be between 0 and 99'
      );
    }

    // First get token decimals
    const decimals = await getTokenDecimals(mintAddress);
    console.log('Token decimals:', decimals);

    // Fetch token accounts
    console.log('Fetching token accounts for:', mintAddress);
    const tokenAccounts = await getTokenAccounts(mintAddress);

    if (!tokenAccounts.result || !tokenAccounts.result.token_accounts.length) {
      throw new NoHoldersError();
    }

    // Process token accounts
    const results = processTokenAccounts(
      tokenAccounts,
      decimals,
      minHoldings,
      numberOfHolders,
      excludeTopPercent
    );

    const endTime = performance.now();
    const processingTimeSeconds = ((endTime - startTime) / 1000).toFixed(2);

    return NextResponse.json({ ...results, processingTimeSeconds });
  } catch (error) {
    console.error('Error processing request:', error);

    // Check if this is a timeout error from Vercel
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        {
          error:
            'Analysis timed out. The token has too many holders to process. Try excluding more top holders or increasing the minimum holdings.',
        },
        { status: 504 }
      );
    }

    if (error instanceof TokenAnalysisError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    // For unexpected errors, return a generic 500 error
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
