export interface Note {
    id: string;
    title: string;
    content: string;
    created: number;
    modified: number;
    tags: string[];
}

export interface Relationship {
    id: string;
    sourceId: string;
    targetId: string;
    type: RelationType;
    metadata: Record<string, any>;
}

export enum RelationType {
    REFERENCE = 'reference',
    PARENT_CHILD = 'parent_child',
    SIMILAR = 'similar',
    CUSTOM = 'custom'
}

export interface Tag {
    id: string;
    name: string;
    color?: string;
    description?: string;
}

export interface SearchResult {
    noteId: string;
    title: string;
    snippet: string;
    score: number;
    matches: SearchMatch[];
}

export interface SearchMatch {
    field: string;
    term: string;
    position: number;
}
