const fs = require('fs');
const target = JSON.parse(fs.readFileSync('c:/Projects/Blockly/node_modules/pxt-microbit/built/target.json', 'utf8'));

const bundledpkgs = target.bundledpkgs;
for (const pkgName in bundledpkgs) {
    const pkg = bundledpkgs[pkgName];
    for (const fileName in pkg) {
        const content = pkg[fileName];
        if (typeof content === 'string' && fileName === 'game.ts') {
            const lines = content.split('\n');
            const idx = lines.findIndex(l => l.includes('enum LedSpriteProperty'));
            if (idx !== -1) {
                console.log(`--- enum LedSpriteProperty ---`);
                for (let i = idx; i < idx + 20 && i < lines.length; i++) {
                    console.log(lines[i]);
                }
            }
        }
    }
}
