// Mock Obsidian API
const mockApp = {
    vault: {
        configDir: '/mock/config/dir'
    },
    workspace: {
        on: jest.fn(),
        getActiveFile: jest.fn()
    }
};

// Global mocks
global.window = {
    setInterval: jest.fn()
} as any;

// Mock sql.js-httpvfs
jest.mock('sql.js-httpvfs', () => ({
    createDbWorker: jest.fn().mockResolvedValue({
        db: {
            query: jest.fn(),
            exec: jest.fn()
        }
    })
}));

// Make mocks available globally
(global as any).app = mockApp;
