/**
 * Error handling utilities and custom error classes
 */

/**
 * Base SDK Error class
 */
export class SDKError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly metadata?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    statusCode?: number,
    metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'SDKError';
    this.code = code;
    this.statusCode = statusCode;
    this.metadata = metadata;

    // Ensure proper prototype chain
    Object.setPrototypeOf(this, SDKError.prototype);
  }
}

/**
 * Configuration Error
 */
export class ConfigError extends SDKError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, 'CONFIG_ERROR', undefined, metadata);
    this.name = 'ConfigError';
    Object.setPrototypeOf(this, ConfigError.prototype);
  }
}

/**
 * Validation Error
 */
export class ValidationError extends SDKError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, metadata);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Network Error
 */
export class NetworkError extends SDKError {
  constructor(message: string, statusCode?: number, metadata?: Record<string, unknown>) {
    super(message, 'NETWORK_ERROR', statusCode, metadata);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Timeout Error
 */
export class TimeoutError extends SDKError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, 'TIMEOUT_ERROR', 408, metadata);
    this.name = 'TimeoutError';
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

/**
 * Format an error for logging
 */
export function formatError(error: Error): Record<string, unknown> {
  const formatted: Record<string, unknown> = {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };

  if (error instanceof SDKError) {
    formatted.code = error.code;
    formatted.statusCode = error.statusCode;
    formatted.metadata = error.metadata;
  }

  return formatted;
}

/**
 * Check if an error is an SDK error
 */
export function isSDKError(error: unknown): error is SDKError {
  return error instanceof SDKError;
}
