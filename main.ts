import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';
import { SQLiteConfig, DatabaseConfig } from './src/core/sqlite/config';
import { Repository } from './src/core/data/repository';
import { SearchModal, RelationshipView } from './src/ui/components';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class SynapsePlugin extends Plugin {
	private db: SQLiteConfig;
	private repository: Repository;
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.db = SQLiteConfig.getInstance();
		this.repository = new Repository();

		// Initialize database
		await this.initializeDatabase();

		// Register views
		this.registerView(
			'relationship-view',
			(leaf: WorkspaceLeaf) => new RelationshipView(leaf)
		);

		// Add commands
		this.addCommand({
			id: 'open-search',
			name: 'Open Search',
			callback: () => {
				new SearchModal(this.app, (note) => {
					// Handle note selection
					console.log('Selected note:', note);
				}).open();
			}
		});

		// Add ribbon icon
		this.addRibbonIcon('search', 'Synapse Search', () => {
			new SearchModal(this.app, (note) => {
				// Handle note selection
				console.log('Selected note:', note);
			}).open();
		});

		// Register event handlers
		this.registerEvent(
			this.app.workspace.on('file-open', () => {
				// Handle file open
				console.log('File opened');
			})
		);

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	private async initializeDatabase() {
		const config: DatabaseConfig = {
			dbPath: this.app.vault.configDir + '/synapse.db',
			pageSize: 4096,
			cacheSize: 5
		};

		try {
			await this.db.initialize(config);
			await this.createTables();
		} catch (error) {
			console.error('Failed to initialize database:', error);
		}
	}

	private async createTables() {
		const tables = [
			`CREATE TABLE IF NOT EXISTS notes (
				id TEXT PRIMARY KEY,
				title TEXT NOT NULL,
				content TEXT,
				created INTEGER NOT NULL,
				modified INTEGER NOT NULL,
				tags TEXT
			)`,
			`CREATE TABLE IF NOT EXISTS relationships (
				id TEXT PRIMARY KEY,
				source_id TEXT NOT NULL,
				target_id TEXT NOT NULL,
				type TEXT NOT NULL,
				metadata TEXT,
				FOREIGN KEY (source_id) REFERENCES notes(id),
				FOREIGN KEY (target_id) REFERENCES notes(id)
			)`,
			`CREATE TABLE IF NOT EXISTS tags (
				id TEXT PRIMARY KEY,
				name TEXT NOT NULL UNIQUE,
				color TEXT,
				description TEXT
			)`,
			`CREATE VIRTUAL TABLE IF NOT EXISTS notes_fts USING fts5(
				title,
				content,
				content='notes',
				content_rowid='id'
			)`
		];

		for (const sql of tables) {
			await this.db.exec(sql);
		}
	}

	onunload() {
		console.log('Unloading Synapse plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: SynapsePlugin;

	constructor(app: App, plugin: SynapsePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
