import { AutomationToolConfig } from '../../agentConfig/toolConfig/schemas';

export const emailSummarizerAgentConfig: AutomationToolConfig = {
  id: 'email-summarizer-agent',
  name: 'Email Thread Summarizer Agent',
  description: 'Analyzes and summarizes email threads to help participants catch up on important discussions',
  version: '1.0.0',
  category: 'email',
  actions: [
    {
      id: 'summarize-thread',
      name: 'Summarize Email Thread',
      description: 'Analyze an email thread and provide a comprehensive summary',
      executionType: 'email',
      requiredInputs: [
        {
          name: 'emailThread',
          type: 'array',
          description: 'Array of email objects containing sender, subject, body, and timestamp',
          required: true
        },
        {
          name: 'participantName',
          type: 'string',
          description: 'Name of the participant requesting the summary',
          required: false
        },
        {
          name: 'summaryType',
          type: 'string',
          description: 'Type of summary: brief, detailed, or action-items',
          required: false,
          defaultValue: 'detailed'
        }
      ],
      supportedApplications: ['gmail', 'outlook', 'thunderbird', 'apple-mail'],
      outputSchema: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          keyPoints: { type: 'array', items: { type: 'string' } },
          actionItems: { type: 'array', items: { type: 'string' } },
          participants: { type: 'array', items: { type: 'string' } },
          timeline: { type: 'string' }
        }
      }
    },
    {
      id: 'extract-decisions',
      name: 'Extract Decisions',
      description: 'Extract key decisions made in the email thread',
      executionType: 'email',
      requiredInputs: [
        {
          name: 'emailThread',
          type: 'array',
          description: 'Array of email objects',
          required: true
        }
      ],
      outputSchema: {
        type: 'object',
        properties: {
          decisions: { type: 'array', items: { type: 'string' } },
          decisionMakers: { type: 'array', items: { type: 'string' } },
          implementationDates: { type: 'array', items: { type: 'string' } }
        }
      }
    }
  ],
  prompts: {
    system: `You are an expert email thread analyzer and summarizer. Your task is to help people quickly understand the key points, decisions, and action items from email conversations they may have missed.

Key capabilities:
1. Identify main topics and themes in email threads
2. Extract key decisions and action items
3. Highlight important deadlines or dates
4. Summarize participant contributions
5. Provide chronological context

Always be concise but comprehensive, focusing on actionable information and important context.`,
    userInstruction: `Please analyze the following email thread and provide a summary based on the requested type. Include:

1. **Main Summary**: Overview of the discussion
2. **Key Points**: Important topics discussed
3. **Action Items**: Tasks or decisions that need follow-up
4. **Participants**: Who was involved and their key contributions
5. **Timeline**: Important dates or deadlines mentioned

Format your response in a clear, structured manner that allows someone to quickly understand what they missed.`,
    examples: [
      `Example input: Email thread about project deadline changes
Example output: 
**Summary**: The team discussed moving the project deadline from March 15 to March 22 due to technical challenges with the authentication system.

**Key Points**:
- Authentication integration taking longer than expected
- Need additional testing time for security review
- Client has been notified and agreed to extension

**Action Items**:
- John to complete auth integration by March 18
- Sarah to schedule security review for March 19-20
- Mike to update project timeline and notify stakeholders

**Timeline**: New deadline March 22, security review March 19-20`
    ]
  },
  executionEnvironment: {
    platform: 'cross-platform',
    dependencies: ['@langchain/core', '@langchain/openai', '@langchain/google-genai']
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
