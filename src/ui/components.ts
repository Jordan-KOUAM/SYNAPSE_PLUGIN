import { App, MarkdownView, Modal, Notice, Setting } from 'obsidian';
import { Repository } from '../core/data/repository';
import { Note, SearchResult } from '../core/data/models';

export class SearchModal extends Modal {
    private repository: Repository;
    private results: SearchResult[] = [];
    private onSelect: (note: Note) => void;

    constructor(app: App, onSelect: (note: Note) => void) {
        super(app);
        this.repository = new Repository();
        this.onSelect = onSelect;
    }

    onOpen() {
        try {
            const { contentEl } = this;
            contentEl.empty();

            new Setting(contentEl)
                .setName('Search')
                .addText(text => text
                    .setPlaceholder('Type to search...')
                    .onChange(async (value) => {
                        try {
                            if (value.length > 2) {
                                this.results = await this.repository.search(value);
                                this.updateResults();
                            }
                        } catch (error) {
                            console.error('Search failed:', error);
                            new Notice('Failed to perform search');
                            throw error;
                        }
                    }));

            const resultsContainer = contentEl.createDiv('search-results');
            resultsContainer.style.maxHeight = '400px';
            resultsContainer.style.overflow = 'auto';
        } catch (error) {
            console.error('Failed to initialize modal:', error);
            throw error;
        }
    }

    private async updateResults() {
        try {
            const resultsContainer = this.contentEl.querySelector('.search-results');
            if (!resultsContainer) return;

            resultsContainer.empty();

            this.results.forEach(result => {
                const resultEl = resultsContainer.createDiv('search-result');
                resultEl.innerHTML = `
                    <div class="title">${result.title}</div>
                    <div class="snippet">${result.snippet}</div>
                    <div class="score">Score: ${result.score.toFixed(2)}</div>
                `;
                
                resultEl.addEventListener('click', async () => {
                    try {
                        const note = await this.repository.getNote(result.noteId);
                        if (note) {
                            this.onSelect(note);
                            this.close();
                        }
                    } catch (error) {
                        console.error('Failed to get note:', error);
                        new Notice('Failed to open note');
                        throw error;
                    }
                });
            });
        } catch (error) {
            console.error('Failed to update results:', error);
            throw error;
        }
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

export class RelationshipView extends MarkdownView {
    private repository: Repository;

    constructor(leaf: any) {
        super(leaf);
        this.repository = new Repository();
    }

    async onload() {
        this.registerEvent(
            this.app.workspace.on('file-open', () => this.updateRelationships())
        );
    }

    private async updateRelationships() {
        try {
            const file = this.app.workspace.getActiveFile();
            if (!file) return;

            const relationships = await this.repository.getRelationships(file.path);
            // Update UI with relationships
            // TODO: Implement relationship visualization
        } catch (error) {
            console.error('Failed to update relationships:', error);
            new Notice('Failed to update relationships');
            throw error;
        }
    }
}
