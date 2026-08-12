const fs = require('fs');
const path = require('path');

function getFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(file));
        } else if (file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
}

const routesDir = path.join(__dirname, 'routes');
const files = getFiles(routesDir);

let brokenCount = 0;
let brokenFiles = [];

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
    let match;
    while ((match = requireRegex.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath.startsWith('.')) {
            const absoluteImportPath = path.resolve(path.dirname(file), importPath);
            let resolved = false;
            try {
                require.resolve(absoluteImportPath);
                resolved = true;
            } catch (e) {
                resolved = false;
            }
            
            if (!resolved) {
                console.log('Broken Import in:', file.replace(__dirname, ''));
                console.log('  ->', importPath);
                brokenCount++;
                if (!brokenFiles.includes(file)) brokenFiles.push(file);
            }
        }
    }
});

console.log('Total broken imports:', brokenCount);
console.log('Total files with broken imports:', brokenFiles.length);
