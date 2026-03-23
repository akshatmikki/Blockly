const fs = require('fs');
const target = JSON.parse(fs.readFileSync('c:/Projects/Blockly/node_modules/pxt-microbit/built/target.json', 'utf8'));

const bundledpkgs = target.bundledpkgs;
for (const pkgName in bundledpkgs) {
    const pkg = bundledpkgs[pkgName];
    for (const fileName in pkg) {
        const content = pkg[fileName];
        if (typeof content === 'string' && (content.includes('class LedSprite') || content.includes('interface LedSprite'))) {
            console.log(`Found in ${pkgName}/${fileName}:`);
            const lines = content.split('\n');
            const idx = lines.findIndex(l => l.includes('class LedSprite') || l.includes('interface LedSprite'));
            console.log(lines.slice(Math.max(0, idx - 5), idx + 20).join('\n'));
        }
    }
}
