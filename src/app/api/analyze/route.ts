import { NextResponse } from 'next/server';
import { getTokenAccounts } from '@/services/helius';
import { getTokenDecimals } from '@/services/token';
import { processTokenAccounts } from '@/services/analysis';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received request body:', body); // Debug log

    const { mintAddress, minHoldings, numberOfHolders, excludeTopPercent } =
      body;

    // First get token decimals
    const decimals = await getTokenDecimals(mintAddress);
    console.log('Token decimals:', decimals);

    // Validate input parameters
    if (!mintAddress) {
      return NextResponse.json(
        { error: 'Contract address is required' },
        { status: 400 }
      );
    }

    if (minHoldings < 0) {
      return NextResponse.json(
        { error: 'Minimum holdings must be positive' },
        { status: 400 }
      );
    }

    if (numberOfHolders < 1) {
      return NextResponse.json(
        { error: 'Number of holders must be at least 1' },
        { status: 400 }
      );
    }

    if (excludeTopPercent < 0 || excludeTopPercent >= 100) {
      return NextResponse.json(
        { error: 'Exclude top percentage must be between 0 and 99' },
        { status: 400 }
      );
    }

    // Fetch token accounts
    console.log('Fetching token accounts for:', mintAddress); // Debug log
    const tokenAccounts = await getTokenAccounts(mintAddress);

    if (!tokenAccounts.result || !tokenAccounts.result.token_accounts.length) {
      return NextResponse.json(
        { error: 'No holders found for this token' },
        { status: 404 }
      );
    }

    console.log('Processing token accounts...'); // Debug log
    const results = processTokenAccounts(
      tokenAccounts,
      decimals,
      minHoldings,
      numberOfHolders,
      excludeTopPercent
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error('API Error:', error); // Debug log

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
