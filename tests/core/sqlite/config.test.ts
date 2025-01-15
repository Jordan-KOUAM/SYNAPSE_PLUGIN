import { SQLiteConfig, DatabaseConfig } from '../../../src/core/sqlite/config';
import { createDbWorker } from 'sql.js-httpvfs';

jest.mock('sql.js-httpvfs', () => ({
    createDbWorker: jest.fn()
}));

describe('SQLiteConfig', () => {
    let config: SQLiteConfig;
    let mockDb: any;
    const mockConfig: DatabaseConfig = {
        dbPath: '/test/db.sqlite',
        pageSize: 4096,
        cacheSize: 5
    };

    beforeEach(() => {
        config = SQLiteConfig.getInstance();
        mockDb = {
            initialize: jest.fn(),
            query: jest.fn(),
            exec: jest.fn()
        };
        (config as any).worker = {
            db: mockDb
        };
    });

    describe('initialize', () => {
        it('should initialize the database successfully', async () => {
            const mockWorker = { db: mockDb };
            (createDbWorker as jest.Mock).mockResolvedValueOnce(mockWorker);

            await config.initialize(mockConfig);

            expect(createDbWorker).toHaveBeenCalledWith(
                [{
                    from: 'inline',
                    config: {
                        serverMode: 'full',
                        url: mockConfig.dbPath,
                        requestChunkSize: mockConfig.pageSize,
                        cacheSizeMB: mockConfig.cacheSize
                    }
                }],
                '/assets/sql.js-httpvfs/sqlite.worker.js',
                '/assets/sql.js-httpvfs/sqlite.wasm'
            );
        });

        it('should handle initialization errors', async () => {
            const error = new Error('Initialization failed');
            (createDbWorker as jest.Mock).mockRejectedValueOnce(error);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            await expect(config.initialize(mockConfig)).rejects.toThrow(error);
            expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to initialize SQLite:', error);

            consoleErrorSpy.mockRestore();
        });
    });

    describe('query', () => {
        it('should execute a query successfully', async () => {
            const expectedResult = [{ id: 1, name: 'test' }];
            mockDb.query.mockResolvedValueOnce(expectedResult);

            const result = await config.query('SELECT * FROM test');

            expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM test', []);
            expect(result).toEqual(expectedResult);
        });

        it('should handle query errors', async () => {
            const error = new Error('Query failed');
            mockDb.query.mockRejectedValueOnce(error);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            await expect(config.query('invalid query')).rejects.toThrow(error);
            expect(consoleErrorSpy).toHaveBeenCalledWith('Query failed:', error);

            consoleErrorSpy.mockRestore();
        });
    });

    describe('exec', () => {
        it('should execute a statement successfully', async () => {
            mockDb.exec.mockResolvedValueOnce(undefined);

            await config.exec('CREATE TABLE test (id INTEGER PRIMARY KEY)');

            expect(mockDb.exec).toHaveBeenCalledWith('CREATE TABLE test (id INTEGER PRIMARY KEY)', []);
        });

        it('should handle execution errors', async () => {
            const error = new Error('Exec failed');
            mockDb.exec.mockRejectedValueOnce(error);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            await expect(config.exec('invalid statement')).rejects.toThrow(error);
            expect(consoleErrorSpy).toHaveBeenCalledWith('Execution failed:', error);

            consoleErrorSpy.mockRestore();
        });
    });
});
