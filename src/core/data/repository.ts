import { Note, Tag, Relationship, RelationType, SearchResult } from './models';
import { SQLiteConfig } from '../sqlite/config';
import crypto from 'crypto';

export class Repository {
    private db: SQLiteConfig;

    constructor(db?: SQLiteConfig) {
        this.db = db || SQLiteConfig.getInstance();
    }

    // Note Operations
    async createNote(note: Omit<Note, 'id'>): Promise<string> {
        const id = crypto.randomUUID();
        const now = Date.now();
        
        await this.db.exec(
            `INSERT INTO notes (id, title, content, created, modified, tags)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [id, note.title, note.content, note.created, note.modified, JSON.stringify(note.tags)]
        );

        return id;
    }

    async getNote(id: string): Promise<Note | null> {
        const notes = await this.db.query<Note>(
            `SELECT * FROM notes WHERE id = ?`,
            [id]
        );

        return notes[0] || null;
    }

    async getNotes(): Promise<Note[]> {
        return await this.db.query<Note>(
            `SELECT * FROM notes ORDER BY modified DESC`
        );
    }

    async updateNote(id: string, note: Partial<Omit<Note, 'id'>>): Promise<void> {
        const updates: string[] = [];
        const values: any[] = [];

        if (note.title !== undefined) {
            updates.push('title = ?');
            values.push(note.title);
        }
        if (note.content !== undefined) {
            updates.push('content = ?');
            values.push(note.content);
        }
        if (note.tags !== undefined) {
            updates.push('tags = ?');
            values.push(JSON.stringify(note.tags));
        }

        updates.push('modified = ?');
        values.push(Date.now());

        values.push(id);

        await this.db.exec(
            `UPDATE notes SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
    }

    async deleteNote(id: string): Promise<void> {
        await this.db.exec(
            `DELETE FROM notes WHERE id = ?`,
            [id]
        );
    }

    // Relationship Operations
    async createRelationship(relationship: Omit<Relationship, 'id'>): Promise<string> {
        const id = crypto.randomUUID();
        
        await this.db.exec(
            `INSERT INTO relationships (id, source_id, target_id, type, metadata)
             VALUES (?, ?, ?, ?, ?)`,
            [id, relationship.sourceId, relationship.targetId, relationship.type, JSON.stringify(relationship.metadata)]
        );

        return id;
    }

    async getRelationship(id: string): Promise<Relationship | null> {
        const relationships = await this.db.query<Relationship>(
            `SELECT * FROM relationships WHERE id = ?`,
            [id]
        );

        return relationships[0] || null;
    }

    async getRelationships(noteId: string): Promise<Relationship[]> {
        return await this.db.query<Relationship>(
            `SELECT * FROM relationships 
             WHERE source_id = ? OR target_id = ?`,
            [noteId, noteId]
        );
    }

    async updateRelationship(id: string, relationship: Partial<Omit<Relationship, 'id'>>): Promise<void> {
        const updates: string[] = [];
        const values: any[] = [];

        if (relationship.sourceId !== undefined) {
            updates.push('source_id = ?');
            values.push(relationship.sourceId);
        }
        if (relationship.targetId !== undefined) {
            updates.push('target_id = ?');
            values.push(relationship.targetId);
        }
        if (relationship.type !== undefined) {
            updates.push('type = ?');
            values.push(relationship.type);
        }
        if (relationship.metadata !== undefined) {
            updates.push('metadata = ?');
            values.push(JSON.stringify(relationship.metadata));
        }

        values.push(id);

        await this.db.exec(
            `UPDATE relationships SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
    }

    async deleteRelationship(id: string): Promise<void> {
        await this.db.exec(
            `DELETE FROM relationships WHERE id = ?`,
            [id]
        );
    }

    // Tag Operations
    async createTag(tag: Omit<Tag, 'id'>): Promise<string> {
        const id = crypto.randomUUID();
        
        await this.db.exec(
            `INSERT INTO tags (id, name, color, description)
             VALUES (?, ?, ?, ?)`,
            [id, tag.name, tag.color, tag.description]
        );

        return id;
    }

    async getTag(id: string): Promise<Tag | null> {
        const tags = await this.db.query<Tag>(
            `SELECT * FROM tags WHERE id = ?`,
            [id]
        );

        return tags[0] || null;
    }

    async getTags(): Promise<Tag[]> {
        return await this.db.query<Tag>(
            `SELECT * FROM tags ORDER BY name`
        );
    }

    async updateTag(id: string, tag: Partial<Omit<Tag, 'id'>>): Promise<void> {
        const updates: string[] = [];
        const values: any[] = [];

        if (tag.name !== undefined) {
            updates.push('name = ?');
            values.push(tag.name);
        }
        if (tag.color !== undefined) {
            updates.push('color = ?');
            values.push(tag.color);
        }
        if (tag.description !== undefined) {
            updates.push('description = ?');
            values.push(tag.description);
        }

        values.push(id);

        await this.db.exec(
            `UPDATE tags SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
    }

    async deleteTag(id: string): Promise<void> {
        await this.db.exec(
            `DELETE FROM tags WHERE id = ?`,
            [id]
        );
    }

    // Search Operations
    async search(query: string): Promise<SearchResult[]> {
        return await this.db.query<SearchResult>(
            `SELECT id as noteId, title, 
                    snippet(notes_fts, 0, '<mark>', '</mark>', '...', 15) as snippet,
                    rank * 100 as score
             FROM notes_fts
             WHERE notes_fts MATCH ?
             ORDER BY rank`,
            [query]
        );
    }
}
