# vsnippet

> 前端视图层的片段组件库。使用scss、vue等形式编写和组织。既可以作为vue组件库，又可以作为view层公共代码库。**可以据此建立团队使用的基础样式和组件库。**

## 静态html/css合成

调用`compose`，以一个vue文件为入口，将scss、vue等文件合成一对html、css。

### 命令行

执行脚本：

```bash
$ node path/to/compose.js -v path/to/view -o path/to/output
```

或配置npm命令：

```json
"scripts": {
    "compose": "vcompose -v path/to/view -o path/to/output"
}
```

### Node.js API

```js
const compose = require('@shenfe/vsnippet');
compose('path/to/view', 'path/to/output');
```

### 示例

运行`node ./compose.js -v example2`，即在`example2`中生成`index.html`、`index.css`文件，是example2的完整html和css。

组件example2的vue形式源码：

```vue
<template lang="pug">
div hello
  example1
</template>

<script>
import Example1 from '../example1'
export default {
  components: {
    Example1
  }
}
</script>
```

合成的组件example2的html、css：

```html
<div>hello<span data-v-24a2967e="" class="name">world</span></div>
```

```css
.name[data-v-24a2967e]{color:#333}
span{background-color:#000}
```
