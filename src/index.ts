import dotenv from 'dotenv';
import * as readlineSync from 'readline-sync';
import { initializeOpenaiModel, initializeOpenaiChatHistory } from './agentConfig/models/openaiService';
import { initializeGoogleModel, initializeGoogleChatHistory } from './agentConfig/models/geminiService';
import { initializeToolSystem, registerBasicAgents } from './agentConfig/toolConfig';
import { HumanMessage } from '@langchain/core/messages';
import { ToolRegistryEntry } from './agentConfig/toolConfig/schemas';
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Load environment variables
dotenv.config();

// Custom model initialization functions
function initializeCustomOpenaiModel(modelName: string): ChatOpenAI {
  return new ChatOpenAI({
    model: modelName,
    temperature: 0,
  });
}

function initializeCustomGoogleModel(modelName: string): ChatGoogleGenerativeAI {
  return new ChatGoogleGenerativeAI({
    model: modelName,
    temperature: 0,
  });
}

// Interactive agent selection functions
function displayMenu(): void {
  console.log('\n🤖 Diffusion-AI Agent Menu');
  console.log('==========================');
  console.log('1. List all available agents');
  console.log('2. Run a specific agent');
  console.log('3. View agent details');
  console.log('4. Compare LLM models');
  console.log('5. Run example tests');
  console.log('6. Exit');
  console.log('==========================');
}

function selectModel(): any {
  console.log('\n🧠 Select Large Language Model (LLM):');
  console.log('====================================');
  console.log('1. OpenAI GPT-4o Mini (Fast, Cost-effective)');
  console.log('2. OpenAI GPT-4o (Advanced, Higher accuracy)');
  console.log('3. Google Gemini Pro (Google\'s flagship model)');
  console.log('4. Google Gemini Flash (Fast, Efficient)');
  console.log('====================================');
  
  const choice = readlineSync.question('Enter your choice (1-4): ');
  
  switch (choice) {
    case '1':
      return { 
        model: initializeCustomOpenaiModel('gpt-4o-mini'), 
        name: 'OpenAI GPT-4o Mini',
        description: 'Fast and cost-effective model for most tasks'
      };
    case '2':
      return { 
        model: initializeCustomOpenaiModel('gpt-4o'), 
        name: 'OpenAI GPT-4o',
        description: 'Advanced model with higher accuracy for complex tasks'
      };
    case '3':
      return { 
        model: initializeCustomGoogleModel('gemini-pro'), 
        name: 'Google Gemini Pro',
        description: 'Google\'s flagship model with strong reasoning capabilities'
      };
    case '4':
      return { 
        model: initializeCustomGoogleModel('gemini-1.5-flash'), 
        name: 'Google Gemini Flash',
        description: 'Fast and efficient model for quick responses'
      };
    default:
      console.log('Invalid choice, defaulting to OpenAI GPT-4o Mini');
      return { 
        model: initializeCustomOpenaiModel('gpt-4o-mini'), 
        name: 'OpenAI GPT-4o Mini',
        description: 'Fast and cost-effective model for most tasks'
      };
  }
}

function listAgents(tools: ToolRegistryEntry[]): void {
  console.log('\n📋 Available Agents:');
  console.log('==================');
  
  const dataFetchingTools = tools.filter(t => t.type === 'data_fetching');
  const automationTools = tools.filter(t => t.type === 'automation');
  
  if (dataFetchingTools.length > 0) {
    console.log('\n🔍 Data Fetching Agents:');
    dataFetchingTools.forEach((tool, index) => {
      console.log(`  ${index + 1}. ${tool.name} (${tool.status}) - v${tool.version}`);
      console.log(`     ID: ${tool.id} | Uses: ${tool.usageCount || 0}`);
    });
  }
  
  if (automationTools.length > 0) {
    console.log('\n⚙️  Automation Agents:');
    automationTools.forEach((tool, index) => {
      console.log(`  ${index + 1}. ${tool.name} (${tool.status}) - v${tool.version}`);
      console.log(`     ID: ${tool.id} | Uses: ${tool.usageCount || 0}`);
    });
  }
}

function selectAgent(tools: ToolRegistryEntry[]): ToolRegistryEntry | null {
  if (tools.length === 0) {
    console.log('❌ No agents available');
    return null;
  }
  
  console.log('\n🎯 Select an Agent:');
  tools.forEach((tool, index) => {
    console.log(`  ${index + 1}. ${tool.name} (${tool.type})`);
  });
  
  const choice = readlineSync.question(`Enter your choice (1-${tools.length}): `);
  const index = parseInt(choice) - 1;
  
  if (index >= 0 && index < tools.length) {
    return tools[index];
  } else {
    console.log('❌ Invalid choice');
    return null;
  }
}

function displayModelComparison(): void {
  console.log('\n🧠 LLM Model Comparison');
  console.log('=======================');
  console.log();
  
  console.log('🚀 OpenAI GPT-4o Mini');
  console.log('  • Speed: ⚡⚡⚡⚡⚡ (Very Fast)');
  console.log('  • Cost: 💰 (Low)');
  console.log('  • Accuracy: ⭐⭐⭐⭐ (High)');
  console.log('  • Best for: General tasks, rapid prototyping, cost-sensitive applications');
  console.log('  • Use cases: Basic analysis, simple automation, quick responses');
  console.log();
  
  console.log('🎯 OpenAI GPT-4o');
  console.log('  • Speed: ⚡⚡⚡ (Fast)');
  console.log('  • Cost: 💰💰💰 (Higher)');
  console.log('  • Accuracy: ⭐⭐⭐⭐⭐ (Excellent)');
  console.log('  • Best for: Complex reasoning, detailed analysis, critical applications');
  console.log('  • Use cases: Complex document analysis, advanced data interpretation');
  console.log();
  
  console.log('🌟 Google Gemini Pro');
  console.log('  • Speed: ⚡⚡⚡ (Fast)');
  console.log('  • Cost: 💰💰 (Medium)');
  console.log('  • Accuracy: ⭐⭐⭐⭐⭐ (Excellent)');
  console.log('  • Best for: Multimodal tasks, reasoning, Google ecosystem integration');
  console.log('  • Use cases: Complex analysis, reasoning tasks, diverse content types');
  console.log();
  
  console.log('⚡ Google Gemini Flash');
  console.log('  • Speed: ⚡⚡⚡⚡⚡ (Very Fast)');
  console.log('  • Cost: 💰 (Low)');
  console.log('  • Accuracy: ⭐⭐⭐⭐ (High)');
  console.log('  • Best for: Real-time applications, high-throughput scenarios');
  console.log('  • Use cases: Quick responses, batch processing, real-time analysis');
  console.log();
  
  console.log('💡 Recommendations:');
  console.log('  • For beginners: Start with GPT-4o Mini or Gemini Flash');
  console.log('  • For complex tasks: Use GPT-4o or Gemini Pro');
  console.log('  • For cost optimization: GPT-4o Mini or Gemini Flash');
  console.log('  • For maximum accuracy: GPT-4o or Gemini Pro');
}

async function runDataFetchingAgent(agentExecutor: any, tool: ToolRegistryEntry, selectedModel: any): Promise<void> {
  console.log(`\n🔍 Running Data Fetching Agent: ${tool.name}`);
  
  if (tool.id === 'crypto-price-agent') {
    const symbol = readlineSync.question('Enter cryptocurrency symbol (e.g., BTC, ETH): ') || 'BTC';
    const convert = readlineSync.question('Convert to currency (default: USD): ') || 'USD';
    const apiToken = readlineSync.question('Enter CoinMarketCap API key (or press Enter to skip): ', { hideEchoBack: true });
    
    if (!apiToken) {
      console.log('⚠️  No API key provided. This will likely fail without a valid CoinMarketCap API key.');
    }
    
    try {
      const result = await agentExecutor.executeDataFetchingAgent({
        toolId: tool.id,
        model: selectedModel.model,
        inputs: {
          apiToken,
          parameters: { symbol: symbol.toUpperCase(), convert: convert.toUpperCase() }
        }
      });
      
      console.log('\n📊 Result:');
      console.log('==========');
      if (result.success) {
        console.log('✅ Analysis:', result.analysis);
      } else {
        console.log('❌ Error:', result.error);
      }
    } catch (error) {
      console.log('❌ Execution failed:', error);
    }
  } else if (tool.id === 'weather-agent') {
    const city = readlineSync.question('Enter city name: ') || 'London';
    const units = readlineSync.question('Units (metric/imperial, default: metric): ') || 'metric';
    const apiToken = readlineSync.question('Enter OpenWeatherMap API key (or press Enter to skip): ', { hideEchoBack: true });
    
    if (!apiToken) {
      console.log('⚠️  No API key provided. This will likely fail without a valid OpenWeatherMap API key.');
    }
    
    try {
      const result = await agentExecutor.executeDataFetchingAgent({
        toolId: tool.id,
        model: selectedModel.model,
        inputs: {
          apiToken,
          parameters: { q: city, units }
        }
      });
      
      console.log('\n🌤️  Result:');
      console.log('==========');
      if (result.success) {
        console.log('✅ Analysis:', result.analysis);
      } else {
        console.log('❌ Error:', result.error);
      }
    } catch (error) {
      console.log('❌ Execution failed:', error);
    }
  }
}

async function runAutomationAgent(agentExecutor: any, tool: ToolRegistryEntry, selectedModel: any): Promise<void> {
  console.log(`\n⚙️  Running Automation Agent: ${tool.name}`);
  
  if (tool.id === 'email-summarizer-agent') {
    console.log('\n📧 Email Thread Summarizer');
    console.log('You can enter a custom email thread or use the default example.');
    
    const useExample = readlineSync.keyInYNStrict('Use example email thread?');
    let emailThread;
    
    if (useExample) {
      emailThread = [
        {
          sender: 'john@company.com',
          subject: 'Project Deadline Update',
          body: 'Hi team, due to the complexity of the authentication system, we need to extend our deadline by one week.',
          timestamp: '2024-01-15T10:00:00Z'
        },
        {
          sender: 'sarah@company.com',
          subject: 'Re: Project Deadline Update',
          body: 'Agreed. I will update the client and adjust our testing schedule accordingly. The security review will need to be rescheduled.',
          timestamp: '2024-01-15T11:30:00Z'
        }
      ];
    } else {
      // For simplicity, we'll use the example - in a real implementation, you could allow custom input
      console.log('Custom email input not implemented yet. Using example thread.');
      emailThread = [
        {
          sender: 'john@company.com',
          subject: 'Project Deadline Update',
          body: 'Hi team, due to the complexity of the authentication system, we need to extend our deadline by one week.',
          timestamp: '2024-01-15T10:00:00Z'
        }
      ];
    }
    
    const participantName = readlineSync.question('Your name (for context): ') || 'User';
    const summaryType = readlineSync.question('Summary type (brief/detailed/action-items, default: detailed): ') || 'detailed';
    
    try {
      const result = await agentExecutor.executeAutomationAgent({
        toolId: tool.id,
        model: selectedModel.model,
        inputs: {
          emailThread,
          participantName,
          summaryType
        }
      });
      
      console.log('\n📧 Email Summary:');
      console.log('================');
      console.log(result.result);
    } catch (error) {
      console.log('❌ Execution failed:', error);
    }
  } else if (tool.id === 'document-analyzer-agent') {
    console.log('\n📄 Document Analyzer');
    console.log('You can enter custom document text or use the default example.');
    
    const useExample = readlineSync.keyInYNStrict('Use example document?');
    let documentContent;
    
    if (useExample) {
      documentContent = `
SOFTWARE LICENSE AGREEMENT

This Software License Agreement ("Agreement") is entered into on January 1, 2024, 
between TechCorp Inc. ("Licensor") and BusinessSolutions LLC ("Licensee").

License Fee: $50,000 annually
Term: 2 years (January 1, 2024 - December 31, 2025)
Automatic Renewal: Yes, unless 90-day written notice is provided
Liability Cap: $100,000

The Licensee agrees to pay the annual license fee within 30 days of each anniversary date.
      `;
    } else {
      documentContent = readlineSync.question('Enter document content: ');
    }
    
    const analysisType = readlineSync.question('Analysis type (summary/comprehensive/contract, default: comprehensive): ') || 'comprehensive';
    const documentType = readlineSync.question('Document type (contract/report/proposal, default: contract): ') || 'contract';
    
    try {
      const result = await agentExecutor.executeAutomationAgent({
        toolId: tool.id,
        model: selectedModel.model,
        inputs: {
          documentContent,
          analysisType,
          documentType
        }
      });
      
      console.log('\n📄 Document Analysis:');
      console.log('====================');
      console.log(result.result);
    } catch (error) {
      console.log('❌ Execution failed:', error);
    }
  }
}

async function runInteractiveMenu(registryManager: any, agentExecutor: any, globalModel: any): Promise<void> {
  while (true) {
    displayMenu();
    const choice = readlineSync.question('Enter your choice (1-6): ');
    
    switch (choice) {
      case '1':
        listAgents(registryManager.listTools());
        break;
        
      case '2':
        const tools = registryManager.listTools();
        const selectedTool = selectAgent(tools);
        
        if (selectedTool) {
          console.log(`\n🤖 Using Model: ${globalModel.name}`);
          console.log(`🔧 Running Agent: ${selectedTool.name}\n`);
          
          if (selectedTool.type === 'data_fetching') {
            await runDataFetchingAgent(agentExecutor, selectedTool, globalModel);
          } else if (selectedTool.type === 'automation') {
            await runAutomationAgent(agentExecutor, selectedTool, globalModel);
          }
        }
        break;
        
      case '3':
        const allTools = registryManager.listTools();
        const toolToView = selectAgent(allTools);
        if (toolToView) {
          console.log('\n📋 Agent Details:');
          console.log('================');
          console.log(`Name: ${toolToView.name}`);
          console.log(`Type: ${toolToView.type}`);
          console.log(`Status: ${toolToView.status}`);
          console.log(`Version: ${toolToView.version}`);
          console.log(`Usage Count: ${toolToView.usageCount || 0}`);
          console.log(`Registered: ${new Date(toolToView.registeredAt).toLocaleString()}`);
          if (toolToView.lastUsed) {
            console.log(`Last Used: ${new Date(toolToView.lastUsed).toLocaleString()}`);
          }
        }
        break;
        
      case '4':
        displayModelComparison();
        break;
        
      case '5':
        console.log('\n🧪 Running Example Tests...');
        console.log(`🤖 Using Model: ${globalModel.name} for all tests\n`);
        await runExampleTests(agentExecutor, globalModel);
        break;
        
      case '6':
        console.log('\n👋 Goodbye!');
        return;
        
      default:
        console.log('❌ Invalid choice. Please try again.');
    }
    
    console.log('\nPress Enter to continue...');
    readlineSync.question('');
  }
}

async function runExampleTests(agentExecutor: any, globalModel: any): Promise<void> {
  
  // Email summarizer test
  console.log('📧 Testing Email Summarizer...');
  const emailThread = [
    {
      sender: 'john@company.com',
      subject: 'Project Deadline Update',
      body: 'Hi team, due to the complexity of the authentication system, we need to extend our deadline by one week.',
      timestamp: '2024-01-15T10:00:00Z'
    },
    {
      sender: 'sarah@company.com',
      subject: 'Re: Project Deadline Update',
      body: 'Agreed. I will update the client and adjust our testing schedule accordingly.',
      timestamp: '2024-01-15T11:30:00Z'
    }
  ];

  try {
    const emailResult = await agentExecutor.executeAutomationAgent({
      toolId: 'email-summarizer-agent',
      model: globalModel.model,
      inputs: {
        emailThread,
        participantName: 'TestUser',
        summaryType: 'detailed'
      }
    });
    console.log('✅ Email Summary Result:');
    console.log(emailResult.result);
  } catch (error) {
    console.log('❌ Email test failed:', error);
  }

  console.log('\n📄 Testing Document Analyzer...');
  const sampleDocument = `
  SOFTWARE LICENSE AGREEMENT
  
  This Software License Agreement ("Agreement") is entered into on January 1, 2024, 
  between TechCorp Inc. ("Licensor") and BusinessSolutions LLC ("Licensee").
  
  License Fee: $50,000 annually
  Term: 2 years (January 1, 2024 - December 31, 2025)
  Automatic Renewal: Yes, unless 90-day written notice is provided
  Liability Cap: $100,000
  
  The Licensee agrees to pay the annual license fee within 30 days of each anniversary date.
  `;

  try {
    const docResult = await agentExecutor.executeAutomationAgent({
      toolId: 'document-analyzer-agent',
      model: globalModel.model,
      inputs: {
        documentContent: sampleDocument,
        analysisType: 'comprehensive',
        documentType: 'contract'
      }
    });
    console.log('✅ Document Analysis Result:');
    console.log(docResult.result);
  } catch (error) {
    console.log('❌ Document test failed:', error);
  }
}

export const main = async () => {
  console.log('🚀 Initializing Diffusion-AI Tool System...\n');

  try {
    // Initialize tool system
    console.log('🔧 Initializing tool configuration system...');
    const { registryManager, agentExecutor } = initializeToolSystem();
    console.log('✅ Tool system initialized successfully\n');

    // Register basic agents
    console.log('📋 Registering basic agents...');
    await registerBasicAgents(registryManager);
    console.log();

    // Select LLM at startup
    console.log('🎯 First, let\'s select your preferred LLM for this session:');
    const globalModel = selectModel();
    
    console.log(`\n✅ Selected Model: ${globalModel.name}`);
    console.log(`📝 Description: ${globalModel.description}`);
    console.log(`🔧 This model will be used for ALL agents in this session.\n`);

    // Display available tools
    console.log('📊 Available Tools:');
    const allTools = registryManager.listTools();
    allTools.forEach(tool => {
      console.log(`  • ${tool.name} (${tool.type}) - v${tool.version}`);
      console.log(`    Status: ${tool.status} | ID: ${tool.id}`);
    });

    console.log('\n🎉 Diffusion-AI Tool System is ready!');
    console.log('💡 Tip: Add API keys to .env file to test data fetching agents\n');

    // Start interactive menu with the selected global model
    await runInteractiveMenu(registryManager, agentExecutor, globalModel);

  } catch (error) {
    console.error('❌ Error initializing system:', error);
  }
};

// Run the main function if this file is executed directly
if (require.main === module) {
main();
}