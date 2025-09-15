/**
 * RAG-specific types and interfaces
 */

import type { BaseConfig, EventEmitter } from './common';

export interface RAGConfig extends BaseConfig {
  vectorDimensions: number;
  chunkSize?: number;
  chunkOverlap?: number;
  similarityThreshold?: number;
  maxResults?: number;
}

export interface RAGEvents {
  indexed: [Document];
  retrieved: [Document[]];
  error: [Error];
}

export interface RAGSystem extends EventEmitter<RAGEvents> {
  addDocument(document: Document): Promise<void>;
  addDocuments(documents: Document[]): Promise<void>;
  retrieve(query: string, options?: RetrievalOptions): Promise<Document[]>;
  search(query: string, options?: SearchOptions): Promise<SearchResult[]>;
}

export interface Document {
  id: string;
  content: string;
  metadata?: Record<string, unknown>;
  embedding?: number[];
  chunks?: DocumentChunk[];
}

export interface DocumentChunk {
  id: string;
  content: string;
  metadata?: Record<string, unknown>;
  embedding?: number[];
  startIndex: number;
  endIndex: number;
}

export interface RetrievalOptions {
  limit?: number;
  threshold?: number;
  filter?: Record<string, unknown>;
}

export interface SearchOptions extends RetrievalOptions {
  includeMetadata?: boolean;
  includeContent?: boolean;
}

export interface SearchResult {
  document: Document;
  score: number;
  chunks?: DocumentChunk[];
}

export interface VectorStore {
  add(id: string, vector: number[], metadata?: Record<string, unknown>): Promise<void>;
  search(vector: number[], limit?: number, threshold?: number): Promise<VectorSearchResult[]>;
  remove(id: string): Promise<void>;
  clear(): Promise<void>;
}

export interface VectorSearchResult {
  id: string;
  score: number;
  metadata?: Record<string, unknown>;
}
