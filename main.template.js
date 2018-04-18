import Vue from 'vue'
import App from 'path/to/target'

new Vue({
    el: '#app',
    render: h => h(App),
    mounted () {
        // You'll need this for renderAfterDocumentEvent.
        document.dispatchEvent(new Event('render-event'))
    }
})
