import { AutomationToolConfig } from '../../agentConfig/toolConfig/schemas';

export const documentAnalyzerAgentConfig: AutomationToolConfig = {
  id: 'document-analyzer-agent',
  name: 'Document Analysis Agent',
  description: 'Analyzes documents for key information, summaries, and insights',
  version: '1.0.0',
  category: 'document',
  actions: [
    {
      id: 'analyze-document',
      name: 'Analyze Document',
      description: 'Perform comprehensive analysis of a document',
      executionType: 'file',
      requiredInputs: [
        {
          name: 'documentContent',
          type: 'string',
          description: 'The text content of the document to analyze',
          required: true
        },
        {
          name: 'analysisType',
          type: 'string',
          description: 'Type of analysis: summary, key-points, sentiment, or comprehensive',
          required: false,
          defaultValue: 'comprehensive'
        },
        {
          name: 'documentType',
          type: 'string',
          description: 'Type of document: contract, report, proposal, email, etc.',
          required: false
        }
      ],
      supportedApplications: ['word', 'google-docs', 'pdf-reader', 'text-editor'],
      outputSchema: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          keyFindings: { type: 'array', items: { type: 'string' } },
          sentiment: { type: 'string' },
          recommendations: { type: 'array', items: { type: 'string' } },
          metadata: { type: 'object' }
        }
      }
    },
    {
      id: 'extract-entities',
      name: 'Extract Entities',
      description: 'Extract important entities like dates, names, companies, amounts',
      executionType: 'file',
      requiredInputs: [
        {
          name: 'documentContent',
          type: 'string',
          description: 'The text content to analyze',
          required: true
        },
        {
          name: 'entityTypes',
          type: 'array',
          description: 'Types of entities to extract: dates, names, companies, amounts, locations',
          required: false,
          defaultValue: ['dates', 'names', 'companies', 'amounts']
        }
      ],
      outputSchema: {
        type: 'object',
        properties: {
          dates: { type: 'array', items: { type: 'string' } },
          names: { type: 'array', items: { type: 'string' } },
          companies: { type: 'array', items: { type: 'string' } },
          amounts: { type: 'array', items: { type: 'string' } },
          locations: { type: 'array', items: { type: 'string' } }
        }
      }
    }
  ],
  prompts: {
    system: `You are an expert document analyzer with the ability to extract key information, provide summaries, and identify important patterns in various types of documents.

Your capabilities include:
1. Comprehensive document summarization
2. Key point extraction
3. Sentiment analysis
4. Entity recognition (dates, names, companies, amounts, locations)
5. Recommendation generation based on document content
6. Risk assessment for contracts and legal documents

Always provide structured, actionable insights that help users understand and act on document content efficiently.`,
    userInstruction: `Please analyze the provided document content according to the specified analysis type. Provide:

1. **Summary**: Concise overview of the document's main purpose and content
2. **Key Findings**: Most important points, facts, or discoveries
3. **Entities**: Important dates, names, companies, amounts, and locations mentioned
4. **Sentiment**: Overall tone and sentiment of the document
5. **Recommendations**: Suggested actions or next steps based on the content

Structure your response clearly and focus on actionable insights.`,
    examples: [
      `Example for contract analysis:
**Summary**: Software licensing agreement between Company A and Company B for a 2-year term with automatic renewal clause.

**Key Findings**:
- License fee: $50,000 annually
- Contract term: 2 years (Jan 1, 2024 - Dec 31, 2025)
- Automatic renewal unless 90-day notice given
- Liability cap: $100,000

**Recommendations**:
- Set calendar reminder for renewal decision by Oct 1, 2025
- Review liability terms with legal team
- Negotiate volume discount for year 2`
    ]
  },
  executionEnvironment: {
    platform: 'cross-platform',
    dependencies: ['@langchain/core', '@langchain/openai', '@langchain/google-genai', 'natural']
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
