const compose = require('@shenfe/vsnippet');

compose('./test/index.vue', './output2').then(({ html, css }) => {
    console.log(html);
    console.log(css);
});
