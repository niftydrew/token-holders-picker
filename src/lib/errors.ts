export class TokenAnalysisError extends Error {
  public code: string;
  public status: number;

  constructor(message: string, code: string, status: number = 500) {
    super(message);
    this.name = 'TokenAnalysisError';
    this.code = code;
    this.status = status;
  }
}

export class HeliusAPIError extends TokenAnalysisError {
  constructor(message: string) {
    super(message, 'HELIUS_API_ERROR', 503);
  }
}

export class ValidationError extends TokenAnalysisError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class NoHoldersError extends TokenAnalysisError {
  constructor() {
    super('No holders found for this token', 'NO_HOLDERS_ERROR', 404);
  }
}

export class TimeoutError extends TokenAnalysisError {
  constructor() {
    super(
      'Analysis timed out. The token has too many holders to process. Try excluding more top holders or increasing the minimum holdings.',
      'TIMEOUT_ERROR',
      504
    );
  }
}

export class InsufficientHoldersError extends TokenAnalysisError {
  constructor(available: number, requested: number) {
    super(
      `Not enough eligible holders. Found ${available}, but ${requested} were requested`,
      'INSUFFICIENT_HOLDERS_ERROR',
      400
    );
  }
}
