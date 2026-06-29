import fs from 'fs';
import path from 'path';

function walk(dir, files = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (/\.(tsx|ts)$/.test(f)) files.push(p);
  }
  return files;
}

const roots = ['apps/mobile/src'];
const cwd = process.cwd();

for (const root of roots) {
  const full = path.join(cwd, root);
  for (const file of walk(full)) {
    let content = fs.readFileSync(file, 'utf8');
    const orig = content;
    if (!content.includes('useTheme()')) continue;
    if (content.includes('const { theme } = useTheme()')) continue;
    if (content.includes('const { theme, mode')) continue;

    content = content.replace(
      /const\s*\{\s*([^}]+)\s*\}\s*=\s*useTheme\(\)\s*;/g,
      (match, props) => {
        const trimmed = props.trim();
        if (trimmed === 'theme' || trimmed.startsWith('theme,')) return match;
        return `const { theme } = useTheme();\n  const { ${trimmed} } = theme;`;
      },
    );

    if (content !== orig) {
      fs.writeFileSync(file, content);
      console.log('Updated:', file);
    }
  }
}
