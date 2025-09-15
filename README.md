# MCP Standard SDK

A comprehensive TypeScript SDK for building MCP Servers, AI Agents, and RAG (Retrieval-Augmented Generation) Models.

## Features

- 🚀 **MCP Server Development** - Build robust Message Control Protocol servers
- 🤖 **AI Agent Framework** - Create intelligent agents with tool integration
- 📚 **RAG System Tools** - Implement retrieval-augmented generation systems
- 🔧 **TypeScript First** - Full type safety and excellent developer experience
- 📦 **Modular Design** - Use only what you need with tree-shaking support
- 🧪 **Well Tested** - Comprehensive test suite with high coverage
- 📖 **Excellent Documentation** - Auto-generated docs with examples

## Installation

```bash
npm install mcp-standard-sdk
```

## Quick Start

### MCP Server

```typescript
import { createMCPServer } from 'mcp-standard-sdk/server';

const server = createMCPServer({
  name: 'my-mcp-server',
  version: '1.0.0',
  description: 'My awesome MCP server'
});

await server.start();
```

### AI Agent

```typescript
import { createAgent } from 'mcp-standard-sdk/agent';

const agent = createAgent({
  name: 'my-agent',
  model: 'gpt-4',
  temperature: 0.7
});

const response = await agent.process({
  message: 'Hello, how can you help me?'
});
```

### RAG System

```typescript
import { createRAGSystem } from 'mcp-standard-sdk/rag';

const rag = createRAGSystem({
  vectorDimensions: 1536,
  chunkSize: 1000,
  chunkOverlap: 200
});

await rag.addDocument({
  id: 'doc1',
  content: 'Your document content here...'
});

const results = await rag.retrieve('search query');
```

## Project Structure

```
src/
├── server/          # MCP Server implementation
│   ├── core/        # Core server functionality
│   ├── handlers/    # Request handlers
│   └── middleware/  # Server middleware
├── agent/           # AI Agent framework
│   ├── core/        # Core agent functionality
│   ├── tools/       # Agent tools and utilities
│   └── memory/      # Memory management
├── rag/             # RAG system implementation
│   ├── core/        # Core RAG functionality
│   ├── vectorstore/ # Vector store implementations
│   └── retrieval/   # Retrieval mechanisms
├── types/           # TypeScript type definitions
└── utils/           # Common utilities
```

## Development

### Prerequisites

- Node.js >= 16.0.0
- TypeScript >= 4.9.0

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd mcp-standard-sdk

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Start development mode
npm run dev
```

### Scripts

- `npm run build` - Build the project
- `npm run dev` - Start development mode with watch
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Lint the code
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking
- `npm run docs:build` - Generate documentation
- `npm run docs:serve` - Serve documentation with watch mode

## Documentation

Full API documentation is available at [docs link] (generated with TypeDoc).

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](docs-url)
- 🐛 [Issues](issues-url)
- 💬 [Discussions](discussions-url)

## Roadmap

- [ ] Complete MCP Server implementation
- [ ] Add AI Agent tool registry
- [ ] Implement vector store backends
- [ ] Add more retrieval strategies
- [ ] Performance optimizations
- [ ] Example applications
- [ ] Plugin system

---

Built with ❤️ by the MCP SDK Team
