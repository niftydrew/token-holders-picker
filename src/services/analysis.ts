import {
  TokenHolder,
  AnalysisResults,
  TokenAccountResponse,
} from '@/lib/types';
import { InsufficientHoldersError } from '@/lib/errors';

export function processTokenAccounts(
  data: TokenAccountResponse,
  decimals: number,
  minHoldings: number,
  numberOfHolders: number,
  excludeTopPercent: number
): AnalysisResults {
  console.log('Decimals:', decimals);
  // Convert token accounts to holders with proper amounts
  const allHolders = data.result.token_accounts.map((account) => ({
    address: account.owner,
    amount: parseFloat(account.amount) / Math.pow(10, decimals),
  }));

  const totalHolders = allHolders.length;

  // Sort holders by amount (descending)
  allHolders.sort((a, b) => b.amount - a.amount);

  // Calculate how many top holders to exclude
  const excludeCount = Math.floor(totalHolders * (excludeTopPercent / 100));

  // Remove top holders and filter by minimum holdings
  const eligibleHolders = allHolders
    .slice(excludeCount) // Remove top holders
    .filter((holder) => holder.amount >= minHoldings);

  if (eligibleHolders.length < numberOfHolders) {
    throw new InsufficientHoldersError(eligibleHolders.length, numberOfHolders);
  }

  // Randomly select the requested number of holders
  const selectedHolders = selectRandomHolders(eligibleHolders, numberOfHolders);

  return {
    totalHolders,
    eligibleHolders: eligibleHolders.length,
    selectedHolders,
  };
}

function selectRandomHolders(
  holders: TokenHolder[],
  count: number
): TokenHolder[] {
  const shuffled = [...holders];

  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}
