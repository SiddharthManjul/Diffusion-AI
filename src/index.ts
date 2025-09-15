/**
 * MCP Standard SDK
 * A comprehensive SDK for building MCP Servers, AI Agents, and RAG Models
 */

// Core exports
export * from './server';
export * from './agent';
export * from './rag';

// Type exports
export * from './types';

// Utility exports
export * from './utils';

// Version information
export const VERSION = '0.1.0';

// SDK metadata
export const SDK_INFO = {
  name: 'MCP Standard SDK',
  version: VERSION,
  description: 'A comprehensive SDK for building MCP Servers, AI Agents, and RAG Models',
  author: 'MCP SDK Team',
} as const;
