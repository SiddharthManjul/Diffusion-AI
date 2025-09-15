/**
 * Logging utilities
 */

import type { Logger } from '../types/common';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LoggerConfig {
  level?: LogLevel;
  prefix?: string;
  timestamp?: boolean;
  colors?: boolean;
}

/**
 * Simple console logger implementation
 */
export class ConsoleLogger implements Logger {
  private readonly config: Required<LoggerConfig>;

  constructor(config: LoggerConfig = {}) {
    this.config = {
      level: config.level ?? LogLevel.INFO,
      prefix: config.prefix ?? '',
      timestamp: config.timestamp ?? true,
      colors: config.colors ?? true,
    };
  }

  private formatMessage(level: string, message: string): string {
    let formatted = '';

    if (this.config.timestamp) {
      formatted += `[${new Date().toISOString()}] `;
    }

    if (this.config.prefix) {
      formatted += `[${this.config.prefix}] `;
    }

    formatted += `[${level}] ${message}`;

    return formatted;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage('DEBUG', message), ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', message), ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message), ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('ERROR', message), ...args);
    }
  }
}

/**
 * No-op logger that doesn't log anything
 */
export class NoOpLogger implements Logger {
  debug(): void {
    // No-op
  }

  info(): void {
    // No-op
  }

  warn(): void {
    // No-op
  }

  error(): void {
    // No-op
  }
}

/**
 * Create a logger instance
 */
export function createLogger(config?: LoggerConfig): Logger {
  return new ConsoleLogger(config);
}

/**
 * Create a no-op logger
 */
export function createNoOpLogger(): Logger {
  return new NoOpLogger();
}
