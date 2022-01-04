# create-vite

今天我们来看看`vite`的脚手架。

这个包主要是用于创建一个项目并根据用户选择配置的`template`将模板文件写入当前创建的目录中。

`vite`提供了多个模板及其`ts`版本。

使用`minimist`解析命令行参数
使用`prompts`包来实现命令行指引配置的功能。
使用`kolorist`包实现不同颜色的关键词。

来看一下这些包的简单使用，方便后续查看`create-vite`中的源码。

## `minimist`
通过`process.argv`获取命令行参数的时候前两个值是固定的，第一个是`node`程序路径，第二个则是当前执行的文件路径。之后的才是输入的各种参数
![请添加图片描述](https://img-blog.csdnimg.cn/fff9c60bcc7b436e83601895d38c351d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAZHJhbGV4c2FuZGVybA==,size_11,color_FFFFFF,t_70,g_se,x_16)

```js
const argv = require('minimist')(process.argv.slice(2), { string: ['_'] })
```
使用`minimist`后可以把输入的参数进行解析，使用`_`保存命令中的各种参数，当匹配到`-`或者`--`字符时忽略后边的所有的参数。`-`、`--`字符后边的命令会添加到对象中，当命令后边有参数(非`options`)，那么该命令的值就是后边的参数，否则值为`true`。

![请添加图片描述](https://img-blog.csdnimg.cn/7c3918e9f5f44ecba17223143ef72b6a.png)


比如上边简单的例子，在`-`命令前有俩参数，则被push进`_`数组中，`-v`后边的参数也是`options`，因此值为true，`-f`后边的参数是12，因此值为12。


## `prompts`

轻量级,美观且用户友好的交互式提示库。

单个提示的传入一个对象即可
```js
const prompts = require('prompts');

(async () => {
  const response = await prompts({
    type: 'text',
    name: 'weather',
    message: 'What is the weather today?',
  });

  console.log(response);
})();
```

![请添加图片描述](https://img-blog.csdnimg.cn/0fc0b3aa94864d2eb7190fbb76d4a64a.png)




多个就需要传入数组。
```js
const prompts = require('prompts');

(async () => {
  const response = await prompts([
    {
      type: 'text',
      name: 'weather',
      message: 'What is the weather today?',
    },
    {
      type: 'confirm',
      name: 'out',
      message: 'Are you going out for fun now?',
    },
  ]);

  console.log(response);
})();
```
![请添加图片描述](https://img-blog.csdnimg.cn/98f50c6f65944085a2fdcf3ef727ba19.png)


动态`prompts`

当`type`为`null`时可以跳过当前这个`prompt`。
```js
(async () => {
  const response = await prompts([
    {
      type: 'text',
      name: 'weather',
      message: 'What is the weather today?',
    },
    {
      type: 'confirm',
      name: 'out',
      message: 'Are you going out for fun now?',
    },
    {
      type: (pre) => (pre ? 'text' : null),
      name: 'fun',
      message: 'Have fun then',
    },
  ]);

  console.log(response);
})();
```

![请添加图片描述](https://img-blog.csdnimg.cn/48322a979a344636b5fee5f694864c82.png)


当`type`为一个函数时，有3个参数，第一个是上一条`prompt`的值，第二个是之前所有`prompts`的键值组成的对象，第三个则是当前`prompt`对象。


## `kolorist`
用于输出不同颜色的字符。
```js
const { yellow, green, cyan, blue } = require('kolorist');

console.log(yellow('yellow'));
console.log(green('green'));
console.log(cyan('cyan'));
console.log(blue('blue'));
```

![请添加图片描述](https://img-blog.csdnimg.cn/54698afc752742869123db149a7f154c.png)



了解以上几个包的简单使用后，我们来看看`create-vite`是如何使用这些包来搭建脚手架的。

## 脚手架配置

项目目录：

![请添加图片描述](https://img-blog.csdnimg.cn/f3704d4c36cf4666ba169a5aad119dc7.png)


### 1. 配置项目名
获取命令后的第一个参数默认为项目名，当未获取到参数时提示用户进行配置，否则跳过进行下一步。
```js
let targetDir = argv._[0]

{
    type: targetDir ? null : 'text',
    name: 'projectName',
    message: 'Project name:',
    initial: defaultProjectName,
    onState: (state) =>
      (targetDir = state.value.trim() || defaultProjectName)
},
```

### 2. 判断项目名是否跟当前已存在的文件名冲突

如果当前目录下不存在重名的文件或者重名文件夹为空，那么跳过进行下一步，否则提示是否覆盖当前文件，为`true`进行下一步，为`false`终止当前命令。

```js
{
    type: () =>
      !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm',
    name: 'overwrite',
    message: () =>
      (targetDir === '.'
        ? 'Current directory'
        : `Target directory "${targetDir}"`) +
      ` is not empty. Remove existing files and continue?`
}
```

### 3. 覆盖文件
当上一步选择覆盖文件时则会进行该提示，用户选择`true`时进行下一步，否则终止命令。
```js
{
    type: (_, { overwrite } = {}) => {
      if (overwrite === false) {
        throw new Error(red('✖') + ' Operation cancelled')
      }
      return null
    },
    name: 'overwriteChecker'
}
```

### 4. 判断文件名是否有效
当文件名有效时跳过进行下一步，如果当前输入的文件名无效，则会提示重新输入，并且对新名字进行相应的匹配判断，只有当`validate`方法的值为`true`才会进行下一步。

```js
// 匹配规则
function isValidPackageName(projectName) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName
  )
}

// 替换规则
function toValidPackageName(projectName) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')
}

{
    type: () => (isValidPackageName(targetDir) ? null : 'text'),
    name: 'packageName',
    message: 'Package name:',
    initial: () => toValidPackageName(targetDir),
    validate: (dir) =>
      isValidPackageName(dir) || 'Invalid package.json name'
}
```

### 5. 模板选择

首先会判断命令行中有没有携带模板参数且该模板存在，有的话进行下一步，没有就展示已有的多个模板提供用户进行选择
```js
let template = argv.template || argv.t

{
    type: template && TEMPLATES.includes(template) ? null : 'select',
    name: 'framework',
    message:
      typeof template === 'string' && !TEMPLATES.includes(template)
        ? `"${template}" isn't a valid template. Please choose from below: `
        : 'Select a framework:',
    initial: 0,
    choices: FRAMEWORKS.map((framework) => {
      const frameworkColor = framework.color
      return {
        title: frameworkColor(framework.name),
        value: framework
      }
    })
}
```

### 6. 语言选择
当选完模板后，`vite`还提供了`js`跟`ts`俩种语言，继续选择。
```js
{
    type: (framework) =>
      framework && framework.variants ? 'select' : null,
    name: 'variant',
    message: 'Select a variant:',
    // @ts-ignore
    choices: (framework) =>
      framework.variants.map((variant) => {
        const variantColor = variant.color
        return {
          title: variantColor(variant.name),
          value: variant.name
        }
    })
}
```

### 7. 生成目录
执行完后就会返回一个对象，包含了所有命令配置信息。

根据之前的是否覆盖选项，进行文件夹生成或者文件清空操作。
```js
const { framework, overwrite, packageName, variant } = result
const root = path.join(cwd, targetDir);

if (overwrite) {
  emptyDir(root);
} else if (!fs.existsSync(root)) {
  fs.mkdirSync(root);
}
```

### 8. 文件写入

根据选择的模板，将模板文件写入上一步的目录中。

`package.json`文件需要额外处理一下，因为要把项目名称及后续的一些提示也给写上去。

```js
template = variant || framework || template;

console.log(`\nScaffolding project in ${root}...`);

const templateDir = path.join(__dirname, `template-${template}`);

const write = (file, content) => {
  const targetPath = renameFiles[file]
    ? path.join(root, renameFiles[file])
    : path.join(root, file);
  if (content) {
    fs.writeFileSync(targetPath, content);
  } else {
    copy(path.join(templateDir, file), targetPath);
  }
};

const files = fs.readdirSync(templateDir);
for (const file of files.filter((f) => f !== 'package.json')) {
  write(file);
}

const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
const pkgManager = pkgInfo ? pkgInfo.name : 'npm';

switch (pkgManager) {
  case 'yarn':
    console.log('  yarn');
    console.log('  yarn dev');
    break;
  default:
    console.log(`  ${pkgManager} install`);
    console.log(`  ${pkgManager} run dev`);
    break;
}
```

整一个`create-vite`包原理其实就是这么简单，模板文件那些就不进行分析了，后续继续推出`vite`核心原理解析。