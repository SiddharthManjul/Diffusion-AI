// Main entry point for tool configuration system
export * from './schemas';
export * from './toolRegistry';
export * from './agentExecutor';

import { ToolRegistryManager } from './toolRegistry';
import { AgentExecutor } from './agentExecutor';

// Initialize the tool configuration system
export function initializeToolSystem(): {
  registryManager: ToolRegistryManager;
  agentExecutor: AgentExecutor;
} {
  const registryManager = new ToolRegistryManager();
  const agentExecutor = new AgentExecutor();
  
  return {
    registryManager,
    agentExecutor
  };
}

// Helper function to register all basic agents
export async function registerBasicAgents(registryManager: ToolRegistryManager): Promise<void> {
  try {
    // Import agent configurations
    const { cryptoPriceAgentConfig } = await import('../../agents/tools/cryptoPriceAgent');
    const { weatherAgentConfig } = await import('../../agents/tools/weatherAgent');
    const { emailSummarizerAgentConfig } = await import('../../agents/tools/emailSummarizerAgent');
    const { documentAnalyzerAgentConfig } = await import('../../agents/tools/documentAnalyzerAgent');

    const agents = [
      { config: cryptoPriceAgentConfig, type: 'data_fetching' as const },
      { config: weatherAgentConfig, type: 'data_fetching' as const },
      { config: emailSummarizerAgentConfig, type: 'automation' as const },
      { config: documentAnalyzerAgentConfig, type: 'automation' as const }
    ];

    let registeredCount = 0;
    let skippedCount = 0;

    for (const { config, type } of agents) {
      try {
        registryManager.registerTool(config, type);
        console.log(`  ✅ Registered: ${config.name}`);
        registeredCount++;
      } catch (error) {
        if (error instanceof Error && error.message.includes('already exists')) {
          console.log(`  ⚠️  Skipped: ${config.name} (already registered)`);
          skippedCount++;
        } else {
          console.error(`  ❌ Failed to register ${config.name}:`, error);
          throw error;
        }
      }
    }
    
    console.log(`✅ Agent registration complete: ${registeredCount} registered, ${skippedCount} skipped`);
  } catch (error) {
    console.error('❌ Error registering basic agents:', error);
    throw error;
  }
}
