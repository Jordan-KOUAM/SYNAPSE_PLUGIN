import { createDbWorker } from 'sql.js-httpvfs';

export interface DatabaseConfig {
    readonly dbPath: string;
    readonly pageSize?: number;
    readonly cacheSize?: number;
}

interface WorkerConfig {
    from: 'inline';
    config: {
        serverMode: 'full';
        url: string;
        requestChunkSize: number;
        cacheSizeMB: number;
    };
}

export class SQLiteConfig {
    private static instance: SQLiteConfig;
    private worker: any;

    private constructor() {}

    public static getInstance(): SQLiteConfig {
        if (!SQLiteConfig.instance) {
            SQLiteConfig.instance = new SQLiteConfig();
        }
        return SQLiteConfig.instance;
    }

    public async initialize(config: DatabaseConfig): Promise<void> {
        const workerConfig: WorkerConfig = {
            from: 'inline',
            config: {
                serverMode: 'full',
                url: config.dbPath,
                requestChunkSize: config.pageSize || 4096,
                cacheSizeMB: config.cacheSize || 5
            }
        };

        try {
            this.worker = await createDbWorker(
                [workerConfig],
                '/assets/sql.js-httpvfs/sqlite.worker.js',
                '/assets/sql.js-httpvfs/sqlite.wasm'
            );
        } catch (error) {
            console.error('Failed to initialize SQLite:', error);
            throw error;
        }
    }

    public async query<T>(sql: string, params: any[] = []): Promise<T[]> {
        try {
            const result = await this.worker.db.query(sql, params);
            return result as T[];
        } catch (error) {
            console.error('Query failed:', error);
            throw error;
        }
    }

    public async exec(sql: string, params: any[] = []): Promise<void> {
        try {
            await this.worker.db.exec(sql, params);
        } catch (error) {
            console.error('Execution failed:', error);
            throw error;
        }
    }
}
