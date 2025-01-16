const fs = require('fs');
const path = require('path');

// Chemins source et destination
const SOURCE_DIR = path.join(__dirname, '..');
const VAULT_DIR = 'C:/Users/jorda/Desktop/SYNAPSE/Rendus-test vault/.obsidian/plugins/synapse-plugin';

// Fichiers à copier
const FILES_TO_COPY = ['main.js', 'manifest.json', 'styles.css'];

// Création du dossier de destination s'il n'existe pas
if (!fs.existsSync(VAULT_DIR)) {
    fs.mkdirSync(VAULT_DIR, { recursive: true });
}

// Copie des fichiers
FILES_TO_COPY.forEach(file => {
    const sourcePath = path.join(SOURCE_DIR, file);
    const destPath = path.join(VAULT_DIR, file);
    
    if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied ${file} to vault`);
    } else {
        console.warn(`Warning: ${file} not found in source directory`);
    }
});

console.log('Files copied to vault successfully!');
