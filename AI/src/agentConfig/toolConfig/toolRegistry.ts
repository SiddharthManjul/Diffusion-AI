import * as fs from 'fs';
import * as path from 'path';
import { ToolRegistry, ToolRegistryEntry, DataFetchingToolConfig, AutomationToolConfig } from './schemas';

export class ToolRegistryManager {
  private registryPath: string;
  private configDir: string;

  constructor(configDir: string = path.join(__dirname, '..', 'toolConfig')) {
    this.configDir = configDir;
    this.registryPath = path.join(configDir, 'registry.json');
    this.initializeRegistry();
  }

  private initializeRegistry(): void {
    if (!fs.existsSync(this.registryPath)) {
      const initialRegistry: ToolRegistry = {
        tools: [],
        lastUpdated: new Date().toISOString(),
        version: '1.0.0'
      };
      this.saveRegistry(initialRegistry);
    }
  }

  private loadRegistry(): ToolRegistry {
    try {
      const data = fs.readFileSync(this.registryPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to load tool registry: ${error}`);
    }
  }

  private saveRegistry(registry: ToolRegistry): void {
    try {
      registry.lastUpdated = new Date().toISOString();
      fs.writeFileSync(this.registryPath, JSON.stringify(registry, null, 2));
    } catch (error) {
      throw new Error(`Failed to save tool registry: ${error}`);
    }
  }

  registerTool(config: DataFetchingToolConfig | AutomationToolConfig, type: 'data_fetching' | 'automation'): void {
    const registry = this.loadRegistry();
    
    // Check if tool already exists
    const existingTool = registry.tools.find(t => t.id === config.id);
    if (existingTool) {
      throw new Error(`Tool with ID ${config.id} already exists`);
    }

    // Save tool configuration to file
    const configFileName = `${config.id}.json`;
    const configPath = path.join(this.configDir, type === 'data_fetching' ? 'dataFetching' : 'automation', configFileName);
    
    // Ensure directory exists
    const configDirPath = path.dirname(configPath);
    if (!fs.existsSync(configDirPath)) {
      fs.mkdirSync(configDirPath, { recursive: true });
    }

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    // Add to registry
    const registryEntry: ToolRegistryEntry = {
      id: config.id,
      name: config.name,
      type,
      status: 'active',
      configPath: path.relative(this.configDir, configPath),
      version: config.version,
      registeredAt: new Date().toISOString(),
      usageCount: 0
    };

    registry.tools.push(registryEntry);
    this.saveRegistry(registry);
  }

  unregisterTool(toolId: string): void {
    const registry = this.loadRegistry();
    const toolIndex = registry.tools.findIndex(t => t.id === toolId);
    
    if (toolIndex === -1) {
      throw new Error(`Tool with ID ${toolId} not found`);
    }

    // Remove config file
    const tool = registry.tools[toolIndex];
    const configPath = path.join(this.configDir, tool.configPath);
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }

    // Remove from registry
    registry.tools.splice(toolIndex, 1);
    this.saveRegistry(registry);
  }

  getToolConfig(toolId: string): DataFetchingToolConfig | AutomationToolConfig {
    const registry = this.loadRegistry();
    const tool = registry.tools.find(t => t.id === toolId);
    
    if (!tool) {
      throw new Error(`Tool with ID ${toolId} not found`);
    }

    const configPath = path.join(this.configDir, tool.configPath);
    try {
      const configData = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(configData);
    } catch (error) {
      throw new Error(`Failed to load tool config for ${toolId}: ${error}`);
    }
  }

  listTools(): ToolRegistryEntry[] {
    const registry = this.loadRegistry();
    return registry.tools;
  }

  getToolsByType(type: 'data_fetching' | 'automation'): ToolRegistryEntry[] {
    const registry = this.loadRegistry();
    return registry.tools.filter(t => t.type === type);
  }

  updateToolStatus(toolId: string, status: 'active' | 'inactive' | 'deprecated'): void {
    const registry = this.loadRegistry();
    const tool = registry.tools.find(t => t.id === toolId);
    
    if (!tool) {
      throw new Error(`Tool with ID ${toolId} not found`);
    }

    tool.status = status;
    this.saveRegistry(registry);
  }

  incrementUsageCount(toolId: string): void {
    const registry = this.loadRegistry();
    const tool = registry.tools.find(t => t.id === toolId);
    
    if (!tool) {
      throw new Error(`Tool with ID ${toolId} not found`);
    }

    tool.usageCount = (tool.usageCount || 0) + 1;
    tool.lastUsed = new Date().toISOString();
    this.saveRegistry(registry);
  }
}
