/**
 * Agent-specific types and interfaces
 */

import type { BaseConfig, EventEmitter } from './common';

export interface AgentConfig extends BaseConfig {
  name: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: AgentTool[];
}

export interface AgentEvents {
  thinking: [string];
  action: [AgentAction];
  response: [AgentResponse];
  error: [Error];
}

export interface Agent extends EventEmitter<AgentEvents> {
  process(input: AgentInput): Promise<AgentResponse>;
  addTool(tool: AgentTool): void;
  removeTool(toolName: string): void;
}

export interface AgentInput {
  message: string;
  context?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface AgentResponse {
  message: string;
  actions?: AgentAction[];
  context?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface AgentAction {
  type: string;
  tool: string;
  parameters: Record<string, unknown>;
  result?: unknown;
}

export interface AgentTool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  execute(params: Record<string, unknown>): Promise<unknown>;
}
