import { jest } from '@jest/globals';
import { Note, Tag, Relationship, RelationType } from '../../src/core/data/models';
import { SQLiteConfig } from '../../src/core/sqlite/config';

// Création de la base de données mockée avec des valeurs par défaut
export const createMockDB = (): SQLiteConfig => {
    const mockDb = {
        exec: jest.fn(),
        query: jest.fn(),
        close: jest.fn(),
        worker: jest.fn(),
        initialize: jest.fn()
    };

    mockDb.exec.mockImplementation(() => Promise.resolve());
    mockDb.query.mockImplementation(() => Promise.resolve([]));
    mockDb.close.mockImplementation(() => Promise.resolve());
    mockDb.worker.mockImplementation(() => Promise.resolve());
    mockDb.initialize.mockImplementation(() => Promise.resolve());

    return mockDb as unknown as SQLiteConfig;
};

// Factory pour les entités mockées
export const createMockNote = (timestamp: number): Note => ({
    id: 'test-uuid',
    title: 'Test Note',
    content: 'Test content',
    created: timestamp,
    modified: timestamp,
    tags: ['test']
});

export const createMockTag = (): Tag => ({
    id: 'test-uuid',
    name: 'test',
    color: '#000000',
    description: 'Test description'
});

export const createMockRelationship = (): Relationship => ({
    id: 'test-uuid',
    sourceId: 'source-id',
    targetId: 'target-id',
    type: RelationType.REFERENCE,
    metadata: {}
});

// Helpers pour les mocks
export const resetMockDB = (mockDb: SQLiteConfig): void => {
    const db = mockDb as any;
    db.exec.mockClear();
    db.query.mockClear();
    db.close.mockClear();
    db.worker.mockClear();
    db.initialize.mockClear();
};

export const mockQueryResult = <T>(mockDb: SQLiteConfig, result: T[]): void => {
    const db = mockDb as any;
    db.query.mockImplementationOnce(() => Promise.resolve(result));
};

export const mockExecSuccess = (mockDb: SQLiteConfig): void => {
    const db = mockDb as any;
    db.exec.mockImplementationOnce(() => Promise.resolve());
};

export const mockExecFailure = (mockDb: SQLiteConfig, error: Error): void => {
    const db = mockDb as any;
    db.exec.mockImplementationOnce(() => Promise.reject(error));
};
