import { jest } from '@jest/globals';
import { Repository } from '../../../src/core/data/repository';
import { Note, Tag, Relationship, RelationType } from '../../../src/core/data/models';
import { createMockDB, createMockNote, createMockTag, createMockRelationship, resetMockDB } from '../../helpers/mockFactories';
import { SQLiteConfig } from '../../../src/core/sqlite/config';

jest.mock('crypto', () => ({
    randomUUID: () => 'test-uuid'
}));

describe('Repository', () => {
    let repository: Repository;
    let mockDb: SQLiteConfig;

    beforeEach(() => {
        mockDb = createMockDB();
        repository = new Repository(mockDb);
    });

    afterEach(() => {
        resetMockDB(mockDb);
    });

    describe('Notes', () => {
        it('should create a note', async () => {
            const timestamp = Date.now();
            const noteData = createMockNote(timestamp);
            const id = await repository.createNote(noteData);
            expect(id).toBe('test-uuid');
            expect((mockDb as any).exec).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO notes'),
                ['test-uuid', noteData.title, noteData.content, noteData.created, noteData.modified, JSON.stringify(noteData.tags)]
            );
        });

        it('should get a note by id', async () => {
            const timestamp = Date.now();
            const noteData = createMockNote(timestamp);
            (mockDb as any).query.mockResolvedValueOnce([noteData]);
            const note = await repository.getNote('test-uuid');
            expect(note).toEqual(noteData);
            expect((mockDb as any).query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM notes WHERE id = ?'),
                ['test-uuid']
            );
        });

        it('should get all notes', async () => {
            const timestamp = Date.now();
            const notesData = [createMockNote(timestamp), createMockNote(timestamp)];
            (mockDb as any).query.mockResolvedValueOnce(notesData);
            const notes = await repository.getNotes();
            expect(notes).toEqual(notesData);
            expect((mockDb as any).query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM notes')
            );
        });

        it('should update a note', async () => {
            const updateData = {
                title: 'Updated Title',
                content: 'Updated content',
                tags: ['updated']
            };
            await repository.updateNote('test-uuid', updateData);
            expect((mockDb as any).exec).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE notes'),
                expect.arrayContaining(['Updated Title', 'Updated content', JSON.stringify(['updated'])])
            );
        });

        it('should delete a note', async () => {
            await repository.deleteNote('test-uuid');
            expect((mockDb as any).exec).toHaveBeenCalledWith(
                expect.stringContaining('DELETE FROM notes'),
                ['test-uuid']
            );
        });
    });

    describe('Tags', () => {
        it('should create a tag', async () => {
            const tagData = createMockTag();
            const id = await repository.createTag(tagData);
            expect(id).toBe('test-uuid');
            expect((mockDb as any).exec).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO tags'),
                ['test-uuid', tagData.name, tagData.color, tagData.description]
            );
        });

        it('should get a tag by id', async () => {
            const tagData = createMockTag();
            (mockDb as any).query.mockResolvedValueOnce([tagData]);
            const tag = await repository.getTag('test-uuid');
            expect(tag).toEqual(tagData);
            expect((mockDb as any).query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM tags WHERE id = ?'),
                ['test-uuid']
            );
        });

        it('should get all tags', async () => {
            const tagsData = [createMockTag(), createMockTag()];
            (mockDb as any).query.mockResolvedValueOnce(tagsData);
            const tags = await repository.getTags();
            expect(tags).toEqual(tagsData);
            expect((mockDb as any).query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM tags')
            );
        });

        it('should update a tag', async () => {
            const updateData = {
                name: 'Updated Tag',
                color: '#111111',
                description: 'Updated description'
            };
            await repository.updateTag('test-uuid', updateData);
            expect((mockDb as any).exec).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE tags'),
                expect.arrayContaining(['Updated Tag', '#111111', 'Updated description'])
            );
        });

        it('should delete a tag', async () => {
            await repository.deleteTag('test-uuid');
            expect((mockDb as any).exec).toHaveBeenCalledWith(
                expect.stringContaining('DELETE FROM tags'),
                ['test-uuid']
            );
        });
    });

    describe('Relationships', () => {
        it('should create a relationship', async () => {
            const relationshipData = createMockRelationship();
            const id = await repository.createRelationship(relationshipData);
            expect(id).toBe('test-uuid');
            expect((mockDb as any).exec).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO relationships'),
                ['test-uuid', relationshipData.sourceId, relationshipData.targetId, relationshipData.type, JSON.stringify(relationshipData.metadata)]
            );
        });

        it('should get a relationship by id', async () => {
            const relationshipData = createMockRelationship();
            (mockDb as any).query.mockResolvedValueOnce([relationshipData]);
            const relationship = await repository.getRelationship('test-uuid');
            expect(relationship).toEqual(relationshipData);
            expect((mockDb as any).query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM relationships WHERE id = ?'),
                ['test-uuid']
            );
        });

        it('should get relationships for a note', async () => {
            const relationshipsData = [createMockRelationship(), createMockRelationship()];
            (mockDb as any).query.mockResolvedValueOnce(relationshipsData);
            const relationships = await repository.getRelationships('test-uuid');
            expect(relationships).toEqual(relationshipsData);
            expect((mockDb as any).query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM relationships'),
                ['test-uuid', 'test-uuid']
            );
        });

        it('should update a relationship', async () => {
            const updateData = {
                sourceId: 'new-source',
                targetId: 'new-target',
                type: RelationType.REFERENCE,
                metadata: { updated: true }
            };
            await repository.updateRelationship('test-uuid', updateData);
            expect((mockDb as any).exec).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE relationships'),
                expect.arrayContaining(['new-source', 'new-target', RelationType.REFERENCE, JSON.stringify({ updated: true })])
            );
        });

        it('should delete a relationship', async () => {
            await repository.deleteRelationship('test-uuid');
            expect((mockDb as any).exec).toHaveBeenCalledWith(
                expect.stringContaining('DELETE FROM relationships'),
                ['test-uuid']
            );
        });
    });

    describe('Search', () => {
        it('should search notes', async () => {
            const searchResults = [
                { noteId: 'test-uuid', title: 'Test Note', snippet: 'Test content', score: 100 }
            ];
            (mockDb as any).query.mockResolvedValueOnce(searchResults);
            const results = await repository.search('test');
            expect(results).toEqual(searchResults);
            expect((mockDb as any).query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT'),
                ['test']
            );
        });
    });
});
