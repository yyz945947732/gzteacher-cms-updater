import path from 'node:path';
import fg from 'fast-glob';
import fs from 'fs-extra';

const SRC_DIR = path.resolve(process.cwd());
const DEFAULT_OUT_DIR = 'dist';

const replacements = [
  // [field.litpic/] => {@ms:file field.litpic/} need first!
  [/\[field\.litpic\/\]/g, '{@ms:file field.litpic/}'],
  // [field.title/] => ${field.title}
  [/\[field\.([a-zA-Z0-9_]+)\/\]/g, (_, key) => `\${field.${key}}`],
  // {ms:field.content/} => ${field.content}
  [/\{ms:field\.([a-zA-Z0-9_]+)\/\}/g, (_, key) => `\${field.${key}}`],
  // ${field:xxx} => ${field.xxx}
  [/\$\{field:([a-zA-Z0-9_]+)\}/g, (_, key) => `\${field.${key}}`],
  // [field.date fmt=yyyy.MM/] => ${field.date?string("yyyy.MM")}
  [/\[field\.date\s+fmt=([a-zA-Z0-9.\-:"']+)\/\]/g, (_, key) => `\${field.date?string("${key}")}`],
  // ${field.date?date?string("yyyy-mm-dd")} => ${field.date?string("yyyy-mm-dd")}
  [/\$\{field\.date\?date\?string\((["'])(.*?)\1\)\}/g, (_, _2, key) => `\${field.date?string("${key}")}`],
  // [[field.date?string("yyyy-mm-dd")/]] => ${field.date?string("yyyy-mm-dd")}
  [/\[\[field\.date\?string\((["'])(.*?)\1\)\/\]\]/g, (_, _2, key) => `\${field.date?string("${key}")}`],
  // [field.content.substring(0,255)] => {@ms:len field.content 255/}
  [/\[field\.content\.substring\(0,(\d+)\)\]/g, (_, key) => `{@ms:len field.content ${key}/}`],
  // ${field.content[0..140]} => {@ms:len field.content 140/}
  [/\$\{field\.content\[0\.\.(\d+)\]\}/g, (_, key) => `{@ms:len field.content ${key}/}`],
];

function runTasks(options) {
  const { outDir = DEFAULT_OUT_DIR } = options;

  async function replaceHtmlFieldsToDist() {
    const files = await fg(['**/*'], {
      ignore: ['node_modules/**', `${outDir}/**`],
      absolute: true,
      cwd: SRC_DIR,
    });

    for (const file of files) {
      const sourcePath = path.resolve(file);
      const relativePath = path.relative(SRC_DIR, file);
      const targetPath = path.resolve(outDir, relativePath);

      const content = await fs.readFile(sourcePath, 'utf8');
      let replaced = content;

      if (file.endsWith('.html') || file.endsWith('.htm')) {
        for (const [regex, replacer] of replacements) {
          replaced = replaced.replace(regex, replacer);
        }
      }

      await fs.ensureDir(path.dirname(targetPath));

      await fs.writeFile(targetPath, replaced, 'utf8');
    }
    console.log('Generated Completed!');
  }

  replaceHtmlFieldsToDist();
}

export default runTasks;
