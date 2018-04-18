# vsnippet

> 前端视图层的片段组件库。使用scss、vue等形式编写和组织。既可以作为vue组件库，又可以作为view层公共代码库。

## 静态html/css合成

调用`compose`。

### 命令行

```bash
$ node path/to/compose.js -v path/to/view -o path/to/output
```

### Node.js API

```js
const compose = require('@shenfe/vsnippet');
compose('./someViewInVue');
compose('@shenfe/vsnippet/someSnippet', './someView');
```
