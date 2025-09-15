/**
 * Server-specific types and interfaces
 */

import type { BaseConfig, EventEmitter } from './common';

export interface MCPServerConfig extends BaseConfig {
  name: string;
  version: string;
  description?: string;
  author?: string;
  license?: string;
}

export interface MCPServerEvents {
  started: [];
  stopped: [];
  error: [Error];
  request: [MCPRequest];
  response: [MCPResponse];
}

export interface MCPServer extends EventEmitter<MCPServerEvents> {
  start(): Promise<void>;
  stop(): Promise<void>;
  handleRequest(request: MCPRequest): Promise<MCPResponse>;
}

export interface MCPRequest {
  id: string;
  method: string;
  params?: unknown;
  timestamp: number;
}

export interface MCPResponse {
  id: string;
  result?: unknown;
  error?: MCPError;
  timestamp: number;
}

export interface MCPError {
  code: number;
  message: string;
  data?: unknown;
}
