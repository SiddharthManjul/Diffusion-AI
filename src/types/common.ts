/**
 * Common types used across the SDK
 */

export interface BaseConfig {
  debug?: boolean;
  version?: string;
}

export interface Logger {
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
}

export type ErrorHandler = (error: Error) => void;

export interface EventEmitter<T = Record<string, unknown[]>> {
  on<K extends keyof T>(event: K, listener: (...args: T[K]) => void): void;
  emit<K extends keyof T>(event: K, ...args: T[K]): boolean;
  off<K extends keyof T>(event: K, listener: (...args: T[K]) => void): void;
}
