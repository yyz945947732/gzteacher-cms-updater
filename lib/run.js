import path from 'node:path';
import fg from 'fast-glob';
import fs from 'fs-extra';

const SRC_DIR = path.resolve(process.cwd());
const DEFAULT_OUT_DIR = 'dist';

const replacements = [
  // [field.litpic/] => {@ms:file field.litpic/} need above!
  [/\[field\.litpic\/\]/g, '{@ms:file field.litpic/}'],
  // [field.link/] => {ms:global.html/}${field.link} need above!
  [/\[field\.link\/\]/g, '{ms:global.html/}${field.link}'],
  // ${field:link} => {ms:global.html/}${field.link} need above!
  [/\$\{field:link\}/g, '{ms:global.html/}${field.link}'],
  // [field.title/] => ${field.title}
  [/\[field\.([a-zA-Z0-9_]+)\/\]/g, (_, key) => `\${field.${key}}`],
  // {ms:field.content/} => ${field.content}
  [/\{ms:field\.([a-zA-Z0-9_]+)\/\}/g, (_, key) => `\${field.${key}}`],
  // ${field:xxx} => ${field.xxx}
  [/\$\{field:([a-zA-Z0-9_]+)\}/g, (_, key) => `\${field.${key}}`],
  // {ms:include filename=head-file.htm/} => <#include "head-file.htm" />
  [/\{ms:include filename=([^\s/]+)\/\}/g, '<#include "$1" />'],
  // {ms:globalskin.url/}/ => /{ms:global.style/}
  [/\{ms:globalskin\.url\/\}/g, '/{ms:global.style/}'],
  // [field.date fmt=yyyy.MM/] => ${field.date?string("yyyy.MM")}
  [/\[field\.date\s+fmt=([a-zA-Z0-9.\-:"'\s]+)\/\]/g, (_, key) => `\${field.date?string("${key}")}`],
  // {ms:field.date fmt=yyyy.MM/} => ${field.date?string("yyyy.MM")}
  [/\{ms:field\.date\s+fmt=([a-zA-Z0-9.\-:"'\s]+)\/\}/g, (_, key) => `\${field.date?string("${key}")}`],
  // ${field.date?date?string("yyyy-mm-dd")} => ${field.date?string("yyyy-mm-dd")}
  [/\$\{field\.date\?date\?string\((["'])(.*?)\1\)\}/g, (_, _2, key) => `\${field.date?string("${key}")}`],
  // [[field.date?string("yyyy-mm-dd")/]] => ${field.date?string("yyyy-mm-dd")}
  [/\[\[field\.date\?string\((["'])(.*?)\1\)\/\]\]/g, (_, _2, key) => `\${field.date?string("${key}")}`],
  // [field.content.substring(0,255)] => {@ms:len field.content 255/}
  [/\[field\.content\.substring\(0,(\d+)\)\]/g, (_, key) => `{@ms:len field.content ${key}/}`],
  // ${field.content[0..140]} => {@ms:len field.content 140/}
  [/\$\{field\.content\[0\.\.(\d+)\]\}/g, (_, key) => `{@ms:len field.content ${key}/}`],
  // "{ms:page.index/}" => "{ms:global.html/}{ms:page.index/}"
  [/"\{ms:page\.(index|pre|next|last)\/\}"/g, '"{ms:global.html/}{ms:page.$1/}"'],
  // "${field.typelink}" => "{ms:global.html/}${field.typelink}"
  [/"\$\{field.typelink\}"/g, '"{ms:global.html/}${field.typelink}"'],
];

function runTasks(options) {
  const { outDir = DEFAULT_OUT_DIR } = options;

  async function replaceHtmlFieldsToDist() {
    await fs.emptyDir(outDir);

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

      if (file.endsWith('.html') || file.endsWith('.htm') || file.endsWith('.css')) {
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
