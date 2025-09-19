import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { ToolRegistryManager } from './toolRegistry';
import { DataFetchingToolConfig, AutomationToolConfig } from './schemas';
import axios from 'axios';

export interface AgentExecutionContext {
  toolId: string;
  model: ChatOpenAI | ChatGoogleGenerativeAI;
  inputs: any;
  promptOverrides?: {
    system?: string;
    userInstruction?: string;
  };
}

export class AgentExecutor {
  private registryManager: ToolRegistryManager;

  constructor() {
    this.registryManager = new ToolRegistryManager();
  }

  async executeDataFetchingAgent(context: AgentExecutionContext): Promise<any> {
    const config = this.registryManager.getToolConfig(context.toolId) as DataFetchingToolConfig;
    
    if (!config) {
      throw new Error(`Data fetching tool ${context.toolId} not found`);
    }

    // Build API request
    const endpoint = config.endpoints[0]; // Use first endpoint for simplicity
    const url = `${config.provider.baseUrl}${endpoint.path}`;
    
    const headers: any = {
      'Content-Type': 'application/json',
    };

    // Add authentication if required
    if (config.provider.requiresAuth && context.inputs.apiToken) {
      if (config.provider.authType === 'api_key' && config.provider.authHeader) {
        headers[config.provider.authHeader] = context.inputs.apiToken;
      } else if (config.provider.authType === 'bearer_token') {
        headers['Authorization'] = `Bearer ${context.inputs.apiToken}`;
      }
    }

    try {
      // Make API request
      const response = await axios({
        method: endpoint.method,
        url,
        headers,
        params: context.inputs.parameters || {},
      });

      // Increment usage count
      this.registryManager.incrementUsageCount(context.toolId);

      // Process response with AI model
      const systemPrompt = context.promptOverrides?.system || 
        `You are a data analysis assistant. Analyze the following API response data and provide insights. 
         Format your response in a clear, structured way that highlights key information.
         API Provider: ${config.provider.name}
         Endpoint: ${endpoint.description}`;

      const userPrompt = context.promptOverrides?.userInstruction || 
        `Please analyze this data and provide insights: ${JSON.stringify(response.data, null, 2)}`;

      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(userPrompt)
      ];

      const aiResponse = await context.model.invoke(messages);

      return {
        success: true,
        rawData: response.data,
        analysis: aiResponse.content,
        metadata: {
          provider: config.provider.name,
          endpoint: endpoint.description,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        metadata: {
          provider: config.provider.name,
          endpoint: endpoint.description,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async executeAutomationAgent(context: AgentExecutionContext): Promise<any> {
    const config = this.registryManager.getToolConfig(context.toolId) as AutomationToolConfig;
    
    if (!config) {
      throw new Error(`Automation tool ${context.toolId} not found`);
    }

    // Validate required inputs
    const action = config.actions[0]; // Use first action for simplicity
    const missingInputs = action.requiredInputs
      .filter(input => input.required && !context.inputs[input.name]);

    if (missingInputs.length > 0) {
      throw new Error(`Missing required inputs: ${missingInputs.map(i => i.name).join(', ')}`);
    }

    try {
      // Use AI model to process the automation task
      const systemPrompt = context.promptOverrides?.system || config.prompts.system;
      const userPrompt = context.promptOverrides?.userInstruction || 
        `${config.prompts.userInstruction}\n\nInput data: ${JSON.stringify(context.inputs, null, 2)}`;

      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(userPrompt)
      ];

      const aiResponse = await context.model.invoke(messages);

      // Increment usage count
      this.registryManager.incrementUsageCount(context.toolId);

      return {
        success: true,
        result: aiResponse.content,
        action: action.name,
        metadata: {
          toolName: config.name,
          actionType: action.executionType,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        metadata: {
          toolName: config.name,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  getAvailableTools(): any[] {
    return this.registryManager.listTools();
  }

  getToolsByType(type: 'data_fetching' | 'automation'): any[] {
    return this.registryManager.getToolsByType(type);
  }
}
