# Synapse Plugin for Obsidian

A powerful SQLite-based knowledge management plugin for Obsidian.

## Features

- Advanced SQLite database integration
- Flexible knowledge organization
- Powerful search capabilities
- Custom relationship management

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- TypeScript knowledge
- Basic understanding of Obsidian Plugin API

### Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start development:
```bash
npm run dev
```

### Project Structure

```
SYNAPSE_PLUGIN/
├── src/              # Source code
│   ├── core/         # Core functionality
│   │   ├── sqlite/   # SQLite implementation
│   │   └── data/     # Data management
│   ├── ui/           # User interface
│   └── features/     # Plugin features
├── tests/            # Test files
└── dist/             # Compiled files
```

### Commands

- `npm run dev`: Start development mode
- `npm run build`: Build production version
- `npm run test`: Run tests
- `npm run lint`: Run linter

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
