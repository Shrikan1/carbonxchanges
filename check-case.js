import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') {
        getFiles(path.join(dir, file), fileList);
      }
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const allFiles = getFiles(path.join(__dirname, 'backend'));
const fileMap = new Map();

// Build a map of lowercase path to exact path
for (const file of allFiles) {
  fileMap.set(file.toLowerCase(), file);
}

let errors = 0;

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const importRegex = /from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith('.')) {
      const dir = path.dirname(file);
      let targetPath = path.resolve(dir, importPath);
      
      // Assume .js or .jsx if no extension
      let possiblePaths = [targetPath, targetPath + '.js', targetPath + '.jsx', path.join(targetPath, 'index.js'), path.join(targetPath, 'index.jsx')];
      
      let found = false;
      for (const p of possiblePaths) {
        if (fileMap.has(p.toLowerCase())) {
          found = true;
          const exactPath = fileMap.get(p.toLowerCase());
          if (exactPath !== p) {
            console.log(`CASE MISMATCH in ${file}:`);
            console.log(`  Imported: ${importPath}`);
            console.log(`  Expected: ${path.relative(dir, exactPath).replace(/\\/g, '/')}`);
            errors++;
          }
          break;
        }
      }
      // We don't log "not found" because it might be a module or something outside src
    }
  }
}

if (errors === 0) {
  console.log("No case mismatches found!");
}
