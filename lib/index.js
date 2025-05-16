import fs from 'fs-extra';

import runTasks from './run.js';

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

const helpText = `@gzteacher/cms-updater v${pkg.version}

  Usage: cms-update [options]

  -h --help              Print this help
  -v --version           Print @gzteacher/cms-updater version number

For more details, please see https://github.com/yyz945947732/@gzteacher/cms-updater`;

const version = () => console.log(`v${pkg.version}`);

const help = () => console.log(helpText);

async function cli(options) {
  if (options.version) {
    version();
  } else if (options.help) {
    help();
  } else {
    return runTasks(options);
  }
  return Promise.resolve();
}

export default cli;
