/**
 * @tags [COMPONENT:MOCK] [TYPE:TEST]
 * Mock implementations for Obsidian API
 */

import { EventRef } from 'obsidian';

// Basic types
export interface Events {
    on(name: string, callback: (...data: any) => any): EventRef;
    off(name: string, callback: (...data: any) => any): void;
    trigger(name: string, ...data: any[]): void;
    tryTrigger(evt: EventRef, args: any[]): void;
}

// DOM Mocking
export class MockDOMElement {
    className = '';
    innerHTML = '';
    textContent = '';
    value = '';
    placeholder = '';
    children: MockDOMElement[] = [];
    parentElement: MockDOMElement | null = null;
    style = {};

    addEventListener = jest.fn();
    removeEventListener = jest.fn();

    createEl(tag: string, attrs?: any): MockDOMElement {
        const el = new MockDOMElement();
        if (attrs) {
            if (attrs.text) el.textContent = attrs.text;
            if (attrs.cls) el.className = attrs.cls;
            if (attrs.value) el.value = attrs.value;
            if (attrs.placeholder) el.placeholder = attrs.placeholder;
        }
        this.children.push(el);
        el.parentElement = this;
        return el;
    }

    appendChild(child: MockDOMElement): void {
        this.children.push(child);
        child.parentElement = this;
    }

    removeChild(child: MockDOMElement): void {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            child.parentElement = null;
        }
    }

    addClass(className: string): void {
        this.className += ` ${className}`;
    }

    removeClass(className: string): void {
        this.className = this.className.replace(className, '').trim();
    }

    empty(): void {
        this.children = [];
        this.innerHTML = '';
        this.textContent = '';
    }

    setText(text: string): void {
        this.innerHTML = text;
        this.textContent = text;
    }
}

class MockHTMLElement extends MockDOMElement {
    tagName: string;

    constructor(tag: string) {
        super();
        this.tagName = tag;
    }
}

class MockInputElement extends MockHTMLElement {
    type: string = 'text';
    
    constructor() {
        super('input');
    }
}

class MockButtonElement extends MockHTMLElement {
    constructor() {
        super('button');
    }
}

// Base Component class
export class Component {
    containerEl: HTMLElement;
    app: any;
    scope: any;

    constructor() {
        this.containerEl = document.createElement('div');
    }

    load(): void {}
    unload(): void {}
    addChild<T extends Component>(component: T): T {
        return component;
    }
    removeChild<T extends Component>(component: T): T {
        return component;
    }
    register(cb: () => any): void {}
    registerEvent(eventRef: EventRef): void {}
    registerInterval(id: number): number { return id; }
    registerDomEvent<K extends keyof WindowEventMap>(
        el: Window,
        type: K,
        callback: (this: HTMLElement, ev: WindowEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    registerDomEvent<K extends keyof DocumentEventMap>(
        el: Document,
        type: K,
        callback: (this: HTMLElement, ev: DocumentEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    registerDomEvent<K extends keyof HTMLElementEventMap>(
        el: HTMLElement,
        type: K,
        callback: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    registerDomEvent(el: any, type: string, callback: any, options?: any): void {}
}

// View classes
export class View extends Component {
    navigation = false;
    leaf: any;
    icon = 'document';

    constructor(leaf: any) {
        super();
        this.leaf = leaf;
    }

    onload(): void {}
    onunload(): void {}
    protected onOpen(): Promise<void> { return Promise.resolve(); }
    protected onClose(): Promise<void> { return Promise.resolve(); }
    onResize(): void {}
    onPaneMenu(menu: any, source: string): void {}
    getViewType(): string { return 'view'; }
    getDisplayText(): string { return 'View'; }
    getIcon(): string { return this.icon; }
    getState(): any { return {}; }
    setState(state: any, result: any): Promise<void> { return Promise.resolve(); }
    getEphemeralState(): any { return {}; }
    setEphemeralState(state: any): void {}
}

export class ItemView extends View {
    constructor(leaf: any) {
        super(leaf);
    }
}

export class MarkdownView extends ItemView {
    file: TFile | null;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
        this.file = null;
    }

    getViewType(): string {
        return 'markdown';
    }

    getDisplayText(): string {
        return this.file?.basename || 'No File';
    }
}

// File system related classes
export class TFile {
    path: string;
    basename: string;
    extension: string;

    constructor(path: string = '') {
        this.path = path;
        this.basename = path ? path.split('/').pop()?.replace(/\.[^/.]+$/, '') || '' : '';
        this.extension = path ? path.split('.').pop() || '' : '';
    }
}

// Workspace related classes
export class WorkspaceLeaf {
    view: View;
    containerEl: HTMLElement;
    app: any;
    parent: any;

    constructor() {
        this.containerEl = document.createElement('div');
    }

    getViewState() {
        return {
            type: 'view',
            state: {}
        };
    }

    setViewState(state: any) {
        return Promise.resolve();
    }

    getEphemeralState() {
        return {};
    }

    setEphemeralState(state: any) {}

    async open(view: View): Promise<View> {
        this.view = view;
        return view;
    }

    openLinkText(linktext: string, sourcePath: string) {
        return Promise.resolve();
    }

    async setActiveView(viewType: string): Promise<void> {}

    getDisplayText(): string {
        return 'Leaf';
    }

    detach() {}

    attach(container: Node) {
        container.appendChild(this.containerEl);
    }

    toggle() {}

    pin() {}

    unpin() {}

    getContainer(): any {
        return this.containerEl;
    }

    setPinned(pinned: boolean) {}

    setDraft(draft: boolean) {}

    setGroupMember(other: any) {}

    getRoot(): any {
        return this;
    }

    getGroup(): any[] {
        return [this];
    }

    on(name: string, callback: (...data: unknown[]) => unknown): EventRef {
        return {} as EventRef;
    }
    
    off(name: string, callback: (...data: unknown[]) => unknown): void {}
    
    offref(ref: EventRef): void {}
    
    trigger(name: string, ...data: unknown[]): void {}
    
    tryTrigger(evt: EventRef, args: unknown[]): void {}
}

export class Workspace {
    private eventHandlers: Map<string, Array<Function>>;
    on: jest.Mock;
    off: jest.Mock;
    getActiveFile: jest.Mock;
    trigger: jest.Mock;

    constructor() {
        this.eventHandlers = new Map<string, Array<Function>>();
        this.on = jest.fn((event: string, callback: Function) => {
            if (!this.eventHandlers.has(event)) {
                this.eventHandlers.set(event, []);
            }
            this.eventHandlers.get(event)?.push(callback);
            return { id: Math.random().toString() };
        });

        this.off = jest.fn((event: string, callback: Function) => {
            const handlers = this.eventHandlers.get(event);
            if (handlers) {
                const index = handlers.indexOf(callback);
                if (index > -1) {
                    handlers.splice(index, 1);
                }
            }
        });

        this.getActiveFile = jest.fn(() => null);

        this.trigger = jest.fn((event: string, ...args: any[]) => {
            const handlers = this.eventHandlers.get(event);
            handlers?.forEach((handler: Function) => handler(...args));
        });
    }
}

// Core application classes
export class App {
    workspace: Workspace;
    vault: Vault;
    metadataCache: MetadataCache;

    constructor() {
        this.workspace = new Workspace();
        this.vault = new Vault();
        this.metadataCache = new MetadataCache();
    }
}

export class Vault {
    adapter: {
        read: jest.Mock;
        write: jest.Mock;
        exists: jest.Mock;
        list: jest.Mock;
    };
    read: jest.Mock;
    write: jest.Mock;
    exists: jest.Mock;
    list: jest.Mock;
    configDir: string;

    constructor() {
        this.adapter = {
            read: jest.fn(),
            write: jest.fn(),
            exists: jest.fn(),
            list: jest.fn()
        };
        this.read = jest.fn();
        this.write = jest.fn();
        this.exists = jest.fn();
        this.list = jest.fn();
        this.configDir = '/mock/config';
    }
}

// UI Components
export class Modal {
    app: App;
    scope: { register: jest.Mock };
    containerEl: MockDOMElement;
    modalEl: MockDOMElement;
    titleEl: MockDOMElement;
    contentEl: MockDOMElement;
    private isOpen: boolean;

    constructor(app: App) {
        this.app = app;
        this.scope = {
            register: jest.fn()
        };
        this.containerEl = new MockDOMElement();
        this.modalEl = new MockDOMElement();
        this.titleEl = new MockDOMElement();
        this.contentEl = new MockDOMElement();
        this.isOpen = false;

        this.modalEl.appendChild(this.titleEl);
        this.modalEl.appendChild(this.contentEl);
        this.containerEl.appendChild(this.modalEl);
    }

    open(): void {
        this.isOpen = true;
        this.onOpen();
    }

    close(): void {
        this.isOpen = false;
        this.onClose();
    }

    onOpen(): void {}
    onClose(): void {}
}

export class Setting {
    containerEl: MockDOMElement;
    settingEl: MockDOMElement;
    infoEl: MockDOMElement;
    nameEl: MockDOMElement;
    descEl: MockDOMElement;
    controlEl: MockDOMElement;

    constructor(containerEl: MockDOMElement) {
        this.containerEl = containerEl;
        this.settingEl = new MockDOMElement();
        this.infoEl = new MockDOMElement();
        this.nameEl = new MockDOMElement();
        this.descEl = new MockDOMElement();
        this.controlEl = new MockDOMElement();

        this.infoEl.appendChild(this.nameEl);
        this.infoEl.appendChild(this.descEl);
        this.settingEl.appendChild(this.infoEl);
        this.settingEl.appendChild(this.controlEl);
        this.containerEl.appendChild(this.settingEl);
    }

    setName(name: string): this {
        this.nameEl.textContent = name;
        return this;
    }

    setDesc(desc: string): this {
        this.descEl.textContent = desc;
        return this;
    }

    addText(callback: (text: TextComponent) => any): this {
        const component = new TextComponent(this.controlEl);
        callback(component);
        return this;
    }

    addButton(callback: (button: ButtonComponent) => any): this {
        const component = new ButtonComponent(this.controlEl);
        callback(component);
        return this;
    }
}

export class TextComponent {
    containerEl: MockDOMElement;
    inputEl: MockInputElement;

    constructor(containerEl: MockDOMElement) {
        this.containerEl = containerEl;
        this.inputEl = new MockInputElement();
        this.containerEl.appendChild(this.inputEl);
    }

    getValue(): string {
        return this.inputEl.value;
    }

    setValue(value: string): this {
        this.inputEl.value = value;
        return this;
    }

    onChange(callback: (value: string) => any): this {
        this.inputEl.addEventListener('change', () => callback(this.getValue()));
        return this;
    }

    setPlaceholder(placeholder: string): this {
        this.inputEl.placeholder = placeholder;
        return this;
    }
}

export class ButtonComponent {
    containerEl: MockDOMElement;
    buttonEl: MockButtonElement;

    constructor(containerEl: MockDOMElement) {
        this.containerEl = containerEl;
        this.buttonEl = new MockButtonElement();
        this.containerEl.appendChild(this.buttonEl);
    }

    setButtonText(text: string): this {
        this.buttonEl.textContent = text;
        return this;
    }

    onClick(callback: () => any): this {
        this.buttonEl.addEventListener('click', callback);
        return this;
    }
}

// Plugin related classes
export abstract class Plugin {
    app: App;
    manifest: Record<string, unknown>;

    constructor(app: App, manifest: Record<string, unknown>) {
        this.app = app;
        this.manifest = manifest;
    }

    onload(): Promise<void> {
        return Promise.resolve();
    }

    onunload(): void {}
}

// Types for metadata
export interface CachedMetadata {
    links?: Array<{
        link: string;
    }>;
    tags?: string[];
}

export class MetadataCache {
    getFileCache(file: TFile): CachedMetadata | null {
        return null;
    }
}

// Notification class
export class Notice {
    constructor(message: string) {
        console.log(`Notice: ${message}`);
    }
}

// Mock implementations
export class MockWorkspace {
    on = jest.fn();
    off = jest.fn();
    getActiveFile = jest.fn();
    onLayoutReady = jest.fn();
    requestSaveLayout = jest.fn();
    getLayout = jest.fn();
    createLeaf = jest.fn();
    setActiveLeaf = jest.fn();
    getLeaf = jest.fn();
    iterateLeaves = jest.fn();
    iterateAllLeaves = jest.fn();
    getLeavesOfType = jest.fn();
    getUnpinnedLeaf = jest.fn();
    getMostRecentLeaf = jest.fn();
    trigger = jest.fn();
    eventHandlers = new Map<string, Function[]>();

    leftSplit = { collapsed: false };
    rightSplit = { collapsed: false };
    leftRibbon = { containerEl: new MockDOMElement() };
    rightRibbon = { containerEl: new MockDOMElement() };
    rootSplit = { collapsed: false };
    activeLeaf = null;
    containerEl = new MockDOMElement();
    layoutReady = true;
    config = {};

    getActiveViewOfType<T>(type: any): T | null {
        return null;
    }

    iterateRootLeaves(callback: (leaf: WorkspaceLeaf) => any): void {
        callback(new WorkspaceLeaf());
    }

    getLastOpenFiles(): string[] {
        return [];
    }

    setActiveLeafAndOpen(leaf: WorkspaceLeaf, state: any): Promise<void> {
        return Promise.resolve();
    }

    duplicateLeaf(leaf: WorkspaceLeaf, direction?: any): Promise<WorkspaceLeaf> {
        return Promise.resolve(new WorkspaceLeaf());
    }

    moveLeafToPopout(leaf: WorkspaceLeaf): WorkspaceLeaf {
        return new WorkspaceLeaf();
    }

    changeLayout(workspace: any): Promise<void> {
        return Promise.resolve();
    }
}

export class MockApp {
    workspace: MockWorkspace;
    vault: MockVault;
    metadataCache: MockMetadataCache;
    keymap: any;
    scope: any;
    fileManager: any;
    lastEvent: any;

    constructor() {
        this.workspace = new MockWorkspace();
        this.vault = new MockVault();
        this.metadataCache = new MockMetadataCache();
        this.keymap = {};
        this.scope = {};
        this.fileManager = {};
        this.lastEvent = null;
    }
}

export class MockView {
    contentEl: HTMLElement;
    app: MockApp;
    
    constructor(leaf: any) {
        this.contentEl = new MockDOMElement() as unknown as HTMLElement;
        this.app = new MockApp();
    }

    onOpen(): Promise<void> {
        return Promise.resolve();
    }

    onClose(): Promise<void> {
        return Promise.resolve();
    }

    getViewType(): string {
        return 'mock-view';
    }
}

export class MockVault {
    adapter: {
        read: jest.Mock;
        write: jest.Mock;
        exists: jest.Mock;
        list: jest.Mock;
    };
    read: jest.Mock;
    write: jest.Mock;
    exists: jest.Mock;
    list: jest.Mock;
    configDir: string;

    constructor() {
        this.adapter = {
            read: jest.fn(),
            write: jest.fn(),
            exists: jest.fn(),
            list: jest.fn()
        };
        this.read = jest.fn();
        this.write = jest.fn();
        this.exists = jest.fn();
        this.list = jest.fn();
        this.configDir = '/mock/config';
    }
}

export class MockMetadataCache {
    getFileCache(file: TFile): CachedMetadata | null {
        return null;
    }
}
