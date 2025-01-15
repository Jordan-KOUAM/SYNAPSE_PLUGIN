export class App {
    workspace: any;
    vault: any;

    constructor() {
        this.workspace = {
            on: jest.fn(),
            off: jest.fn(),
            getActiveFile: jest.fn(),
            getLeaf: jest.fn().mockReturnValue({
                view: new MarkdownView({})
            })
        };
        this.vault = {
            adapter: {
                read: jest.fn(),
                write: jest.fn(),
                exists: jest.fn(),
                list: jest.fn()
            },
            getAbstractFileByPath: jest.fn(),
            read: jest.fn(),
            create: jest.fn(),
            createBinary: jest.fn(),
            delete: jest.fn(),
            rename: jest.fn(),
            modify: jest.fn(),
            copy: jest.fn(),
            getAllLoadedFiles: jest.fn()
        };
    }
}

export class Workspace {
    on = jest.fn();
    off = jest.fn();
    getActiveFile = jest.fn();
    getLeaf = jest.fn().mockReturnValue({
        view: new MarkdownView({})
    });
}

export class Vault {
    adapter = {
        read: jest.fn(),
        write: jest.fn(),
        exists: jest.fn(),
        list: jest.fn()
    };
}

export class MarkdownView {
    app: App;
    file: any;

    constructor(leaf: any) {
        this.app = new App();
        this.file = null;
    }

    getViewType() {
        return 'markdown';
    }

    getDisplayText() {
        return '';
    }

    onload() {}
    onunload() {}
}

export class Notice {
    constructor(message: string) {}
    setMessage(message: string) { return this; }
    hide() { return this; }
}

export class Setting {
    containerEl: HTMLElement;
    private settingEl: HTMLElement;

    constructor(containerEl: HTMLElement) {
        this.containerEl = containerEl;
        this.settingEl = document.createElement('div');
        this.containerEl.appendChild(this.settingEl);
    }

    setName(name: string): this {
        return this;
    }

    setDesc(desc: string): this {
        return this;
    }

    addText(callback: (text: TextComponent) => any): this {
        const text = new TextComponent(this.settingEl);
        callback(text);
        return this;
    }

    addButton(callback: (button: ButtonComponent) => any): this {
        const button = new ButtonComponent(this.settingEl);
        callback(button);
        return this;
    }
}

export class TextComponent {
    containerEl: HTMLElement;
    inputEl: HTMLInputElement;

    constructor(containerEl: HTMLElement) {
        this.containerEl = containerEl;
        this.inputEl = document.createElement('input');
        this.containerEl.appendChild(this.inputEl);
    }

    setValue(value: string): this {
        this.inputEl.value = value;
        return this;
    }

    getValue(): string {
        return this.inputEl.value;
    }

    setPlaceholder(placeholder: string): this {
        this.inputEl.placeholder = placeholder;
        return this;
    }

    onChange(callback: (value: string) => any): this {
        this.inputEl.addEventListener('input', (e) => {
            callback((e.target as HTMLInputElement).value);
        });
        return this;
    }
}

export class ButtonComponent {
    containerEl: HTMLElement;
    buttonEl: HTMLButtonElement;

    constructor(containerEl: HTMLElement) {
        this.containerEl = containerEl;
        this.buttonEl = document.createElement('button');
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

export class Modal {
    app: App;
    contentEl: any;

    constructor(app: App) {
        this.app = app;
        this.contentEl = {
            empty: jest.fn(),
            createDiv: jest.fn().mockReturnValue({
                style: {},
                createDiv: jest.fn(),
                querySelector: jest.fn()
            })
        };
    }

    open() {
        return this;
    }

    close() {
        return this;
    }

    onOpen(): void {}
    onClose(): void {}
}

export class PluginSettingTab {
    app: App;
    containerEl: HTMLElement;

    constructor(app: App) {
        this.app = app;
        this.containerEl = document.createElement('div');
    }

    display(): void {}
    hide(): void {}
}

export class Plugin {
    app: App;
    manifest: any;

    constructor() {
        this.app = new App();
        this.manifest = {};
    }

    loadData(): Promise<any> {
        return Promise.resolve({});
    }

    saveData(data: any): Promise<void> {
        return Promise.resolve();
    }
}

export class Component {
    containerEl: HTMLElement;

    constructor() {
        this.containerEl = document.createElement('div');
    }

    load(): void {}
    unload(): void {}
}

export class ItemView extends Component {
    app: App;
    leaf: any;
    contentEl: HTMLElement;

    constructor(leaf: any) {
        super();
        this.app = new App();
        this.leaf = leaf;
        this.contentEl = document.createElement('div');
        this.contentEl.empty = jest.fn();
        this.contentEl.createEl = jest.fn().mockReturnValue({
            setPlaceholder: jest.fn().mockReturnThis(),
            onChange: jest.fn().mockReturnThis()
        });
        this.contentEl.createDiv = jest.fn().mockReturnValue({
            empty: jest.fn()
        });
    }

    onload(): void {}
    onunload(): void {}
}

export class WorkspaceLeaf {
    view: any;
    
    constructor() {
        this.view = {};
    }

    getViewState() {
        return {};
    }
}
