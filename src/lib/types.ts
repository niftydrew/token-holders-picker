// Token Holder Types
export interface TokenHolder {
  address: string;
  amount: number;
}

export interface TokenHolderWithUSD extends TokenHolder {
  usdValue?: number;
}

// Analysis Results
export interface AnalysisStats {
  mean: number;
  standardDeviation: number;
  lowerBound: number;
  upperBound: number;
  totalHolders: number;
  eligibleHolders: number;
  selectedHolders: number;
}

// API Response Types
export interface TokenAccountResponse {
  result: {
    token_accounts: Array<{
      owner: string;
      amount: string;
      decimals: string;
    }>;
  };
}

// Form Types
export interface TokenAnalysisForm {
  mintAddress: string;
  minHoldings: number;
  numberOfHolders: number;
  standardDeviationRange: number;
}

// Analysis Parameters
export interface AnalysisParams {
  mintAddress: string;
  minHoldings: number;
  numberOfHolders: number;
  excludeTopPercent: number; // New parameter to exclude top holders
}

export interface AnalysisConfig {
  minHoldings: number;
  numberOfHolders: number;
  standardDeviationRange: number;
}

export interface AnalysisResults {
  totalHolders: number;
  eligibleHolders: number;
  selectedHolders: TokenHolder[];
}
