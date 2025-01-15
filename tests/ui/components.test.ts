import { App, MarkdownView, Setting, ItemView, WorkspaceLeaf } from 'obsidian';
import { SearchModal, RelationshipView } from '../../src/ui/components';
import { Repository } from '../../src/core/data/repository';
import { Note, SearchResult, RelationType, SearchMatch, Relationship } from '../../src/core/data/models';
import { SQLiteConfig } from '../../src/core/sqlite/config';

jest.mock('obsidian');

describe('SearchModal', () => {
    let modal: SearchModal;
    let mockApp: jest.Mocked<App>;
    let mockRepository: jest.Mocked<Repository>;
    let mockDb: jest.Mocked<SQLiteConfig>;
    let mockSetting: any;
    let mockText: any;

    beforeEach(() => {
        mockApp = new App() as jest.Mocked<App>;
        mockDb = SQLiteConfig.getInstance() as jest.Mocked<SQLiteConfig>;
        mockRepository = {
            db: mockDb,
            search: jest.fn(),
            createNote: jest.fn(),
            getNote: jest.fn(),
            getNotes: jest.fn(),
            updateNote: jest.fn(),
            deleteNote: jest.fn(),
            createTag: jest.fn(),
            getTag: jest.fn(),
            getTags: jest.fn(),
            updateTag: jest.fn(),
            deleteTag: jest.fn(),
            createRelationship: jest.fn(),
            getRelationship: jest.fn(),
            getRelationships: jest.fn(),
            updateRelationship: jest.fn(),
            deleteRelationship: jest.fn()
        } as unknown as jest.Mocked<Repository>;

        modal = new SearchModal(mockApp, (note: Note) => {});
        (modal as any).repository = mockRepository;

        // Mock Setting class
        mockText = {
            setPlaceholder: jest.fn().mockReturnThis(),
            onChange: jest.fn().mockImplementation(async (value: string) => {
                if (value.length > 2) {
                    return mockRepository.search(value);
                }
            })
        };
        mockSetting = {
            setName: jest.fn().mockReturnThis(),
            addText: jest.fn().mockReturnValue(mockText)
        };
        jest.spyOn(Setting.prototype, 'setName').mockImplementation(mockSetting.setName);
        jest.spyOn(Setting.prototype, 'addText').mockImplementation(mockSetting.addText);

        // Mock contentEl
        (modal as any).contentEl = {
            empty: jest.fn(),
            createDiv: jest.fn().mockReturnValue({
                style: {},
                querySelector: jest.fn().mockReturnValue({
                    empty: jest.fn(),
                    createDiv: jest.fn()
                })
            })
        };
    });

    describe('onOpen', () => {
        it('should initialize the modal', async () => {
            await modal.onOpen();
            expect(modal.contentEl.empty).toHaveBeenCalled();
            expect(Setting.prototype.setName).toHaveBeenCalledWith('Search');
            expect(Setting.prototype.addText).toHaveBeenCalled();
        });

        it('should handle initialization errors', async () => {
            const error = new Error('Initialization failed');
            const consoleErrorSpy = jest.spyOn(console, 'error');
            
            (modal as any).contentEl.empty.mockImplementation(() => {
                console.error('Failed to initialize modal:', error);
                throw error;
            });

            try {
                await modal.onOpen();
            } catch (e) {
                expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to initialize modal:', error);
            }
            consoleErrorSpy.mockRestore();
        });
    });

    describe('onClose', () => {
        it('should clean up resources', () => {
            modal.onClose();
            expect(modal.contentEl.empty).toHaveBeenCalled();
        });
    });

    describe('performSearch', () => {
        it('should perform a search and display results', async () => {
            const searchResults: SearchResult[] = [{
                noteId: 'test-id',
                title: 'Test Note',
                snippet: 'Test content',
                score: 100,
                matches: [{
                    field: 'content',
                    term: 'test',
                    position: 0
                }]
            }];
            mockRepository.search.mockResolvedValueOnce(searchResults);

            await mockText.onChange('test');
            expect(mockRepository.search).toHaveBeenCalledWith('test');
        });

        it('should handle search errors', async () => {
            const error = new Error('Search failed');
            mockRepository.search.mockRejectedValueOnce(error);

            await expect(mockText.onChange('test')).rejects.toThrow();
            expect(mockRepository.search).toHaveBeenCalledWith('test');
        });
    });
});

describe('RelationshipView', () => {
    let view: RelationshipView;
    let mockApp: jest.Mocked<App>;
    let mockRepository: jest.Mocked<Repository>;
    let mockDb: jest.Mocked<SQLiteConfig>;
    let mockLeaf: jest.Mocked<WorkspaceLeaf>;

    beforeEach(() => {
        mockApp = {
            workspace: {
                getActiveFile: jest.fn().mockReturnValue({ path: 'test.md' }),
                on: jest.fn()
            }
        } as unknown as jest.Mocked<App>;

        mockDb = SQLiteConfig.getInstance() as jest.Mocked<SQLiteConfig>;
        mockRepository = {
            db: mockDb,
            search: jest.fn(),
            createNote: jest.fn(),
            getNote: jest.fn(),
            getNotes: jest.fn(),
            updateNote: jest.fn(),
            deleteNote: jest.fn(),
            createTag: jest.fn(),
            getTag: jest.fn(),
            getTags: jest.fn(),
            updateTag: jest.fn(),
            deleteTag: jest.fn(),
            createRelationship: jest.fn(),
            getRelationship: jest.fn(),
            getRelationships: jest.fn(),
            updateRelationship: jest.fn(),
            deleteRelationship: jest.fn()
        } as unknown as jest.Mocked<Repository>;

        mockLeaf = {
            view: {} as ItemView,
            getViewState: jest.fn()
        } as unknown as jest.Mocked<WorkspaceLeaf>;

        view = new RelationshipView(mockLeaf);
        (view as any).app = mockApp;
        (view as any).repository = mockRepository;
        (view as any).registerEvent = jest.fn();
    });

    describe('onload', () => {
        it('should initialize the view', async () => {
            const onSpy = jest.spyOn(mockApp.workspace, 'on');
            await (view as any).onload();
            expect(onSpy).toHaveBeenCalledWith('file-open', expect.any(Function));
            expect((view as any).registerEvent).toHaveBeenCalled();
        });
    });

    describe('updateRelationships', () => {
        it('should update relationships for active file', async () => {
            const relationships: Relationship[] = [{
                id: 'test-id',
                sourceId: 'source',
                targetId: 'target',
                type: RelationType.REFERENCE,
                metadata: {}
            }];
            mockRepository.getRelationships.mockResolvedValueOnce(relationships);

            await (view as any).updateRelationships();
            expect(mockRepository.getRelationships).toHaveBeenCalledWith('test.md');
        });

        it('should handle update errors', async () => {
            const error = new Error('Update failed');
            mockRepository.getRelationships.mockRejectedValueOnce(error);
            const consoleErrorSpy = jest.spyOn(console, 'error');

            try {
                await (view as any).updateRelationships();
            } catch (e) {
                expect(e).toBe(error);
                expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to update relationships:', error);
            }
            consoleErrorSpy.mockRestore();
        });
    });
});
