

// API Endpoints
export const HELIUS_RPC_URL = `${process.env.RPC_URL}${process.env.HELIUS_API_KEY}`;

// Token Configuration
export const TOKEN_DECIMALS = 9; // Default SPL token decimals

// Form Defaults
export const DEFAULT_ANALYSIS_CONFIG = {
  minHoldings: 1,
  numberOfHolders: 500,
  standardDeviationRange: 0.5,
} as const;

// Form Constraints
export const FORM_CONSTRAINTS = {
  minHoldings: {
    min: 0.000001,
    max: 1000000000,
  },
  numberOfHolders: {
    min: 1,
    max: 1000000,
  },
  standardDeviationRange: {
    min: 0.1,
    max: 2,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_MINT: 'Invalid token mint address',
  NO_HOLDERS: 'No holders found for this token',
  FETCH_ERROR: 'Error fetching token holders',
  INVALID_RESPONSE: 'Invalid response from API',
  INVALID_MIN_HOLDINGS: 'Minimum holdings must be greater than 0',
  INVALID_HOLDERS_COUNT: 'Number of holders must be between 1 and 10,000',
} as const;

// Validation
export const SOLANA_ADDRESS_LENGTH = 44;
export const SOLANA_ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

// Table Settings
export const TABLE_PAGE_SIZE = 10;
export const TABLE_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// File Names
export const OUTPUT_FILES = {
  ALL_HOLDERS: 'all_holders.json',
  SELECTED_HOLDERS: 'selected_holders_with_amounts.json',
  SELECTED_ADDRESSES: 'selected_addresses.txt',
} as const;
