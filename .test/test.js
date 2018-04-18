const compose = require('@shenfe/vsnippet');

const { html, css } = compose('test', 'output2');

console.log(html);
console.log(css);
