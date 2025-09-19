// Tool configuration schemas and types

export interface ApiProvider {
  name: string;
  baseUrl: string;
  requiresAuth: boolean;
  authType?: 'api_key' | 'bearer_token' | 'basic_auth';
  authHeader?: string; // e.g., 'X-CMC_PRO_API_KEY', 'Authorization'
  rateLimit?: {
    requestsPerMinute: number;
    requestsPerHour?: number;
  };
}

export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  parameters?: {
    required?: string[];
    optional?: string[];
  };
  responseFormat: 'json' | 'xml' | 'text';
  description: string;
}

export interface DataFetchingToolConfig {
  id: string;
  name: string;
  description: string;
  version: string;
  provider: ApiProvider;
  endpoints: ApiEndpoint[];
  outputFormat: {
    type: 'structured' | 'raw';
    schema?: any; // JSON schema for structured output
  };
  examples?: {
    input: any;
    output: any;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface AutomationAction {
  id: string;
  name: string;
  description: string;
  executionType: 'email' | 'file' | 'api' | 'custom';
  requiredInputs: {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    description: string;
    required: boolean;
    defaultValue?: any;
  }[];
  supportedApplications?: string[]; // e.g., ['gmail', 'outlook', 'thunderbird']
  outputSchema?: any;
}

export interface AutomationToolConfig {
  id: string;
  name: string;
  description: string;
  version: string;
  category: 'email' | 'document' | 'workflow' | 'communication' | 'analysis';
  actions: AutomationAction[];
  prompts: {
    system: string;
    userInstruction: string;
    examples?: string[];
  };
  executionEnvironment: {
    platform: 'node' | 'browser' | 'cross-platform';
    dependencies?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ToolRegistryEntry {
  id: string;
  name: string;
  type: 'data_fetching' | 'automation';
  status: 'active' | 'inactive' | 'deprecated';
  configPath: string;
  version: string;
  author?: string;
  tags?: string[];
  registeredAt: string;
  lastUsed?: string;
  usageCount?: number;
}

export interface ToolRegistry {
  tools: ToolRegistryEntry[];
  lastUpdated: string;
  version: string;
}
