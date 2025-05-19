# @gzteacher/cms-updater

<p>
  <a href="https://www.npmjs.com/package/@gzteacher/cms-updater">
    <img src="https://img.shields.io/npm/v/@gzteacher/cms-updater.svg" alt="Version" />
  </a>
  <a href="https://github.com/yyz945947732/@gzteacher/cms-updater/pulls">
    <img
      src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"
      alt="PRs Welcome"
    />
  </a>
  <a href="/LICENSE.md">
    <img
      src="https://img.shields.io/badge/license-MIT-blue.svg"
      alt="GitHub license"
    />
  </a>
</p>

🚀 一键更新 cms 旧语法到新语法

[cms 参考文档](http://doc.mingsoft.net/mcms/mo-ban-zhi-zuo/jiu-mo-ban-kuai-su-sheng-ji.html)

## Quick start

### 本地安装

```sh
npm install -D @gzteacher/cms-updater
```

`package.json` 文件添加以下命令:

```json
"scripts": {
  "update": "cms-update"
}
```

执行命令运行脚本：

```bash
npm run update
```

### 全局安装

```sh
npm install -g @gzteacher/cms-updater
```

通过 `npx` 直接运行：

```sh
npx cms-update
```

## Options

```sh
-h --help              Print this help
-v --version           Print @gzteacher/cms-server version number
-d --out-dir <dir>     Customize the output directory, (default "dist")
```

## LICENSE

[MIT](https://github.com/yyz945947732/@gzteacher/cms-updater/blob/master/LICENSE)

---

This project is created using [generator-stupid-cli](https://github.com/yyz945947732/generator-stupid-cli).
