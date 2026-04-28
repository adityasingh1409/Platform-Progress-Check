const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(srcDir);

const replacements = [
    { from: /darkBg/g, to: 'lightBg' },
    { from: /darkCard/g, to: 'lightCard' },
    { from: /text-white/g, to: 'text-gray-900' },
    { from: /text-gray-400/g, to: 'text-gray-600' },
    { from: /text-gray-300/g, to: 'text-gray-700' },
    { from: /text-gray-500/g, to: 'text-gray-500' },
    { from: /bg-gray-900\/50/g, to: 'bg-gray-50' },
    { from: /bg-gray-800\/40/g, to: 'bg-gray-100' },
    { from: /bg-gray-800\/50/g, to: 'bg-gray-100' },
    { from: /border-gray-800/g, to: 'border-gray-200' },
    { from: /border-gray-700/g, to: 'border-gray-300' },
    { from: /hover:bg-gray-800\/50/g, to: 'hover:bg-gray-50' },
    { from: /divide-gray-800/g, to: 'divide-gray-200' },
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content;
    replacements.forEach(r => {
        newContent = newContent.replace(r.from, r.to);
    });
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Updated ${file}`);
    }
});
