const path = require('path')
const webpack = require('webpack')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const isPro = process.env.NODE_ENV === 'production'

module.exports = {
    entry: './main.js',
    output: {
        path: path.resolve(__dirname, './.dist'),
        publicPath: '/.dist/',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: isPro ? ExtractTextPlugin.extract({
                    use: 'css-loader',
                    fallback: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
                }) : [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    extractCSS: !!isPro
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        overlay: true
    },
    performance: {
        hints: false
    },
    devtool: isPro ? '#source-map' : '#eval-source-map',
    plugins: !isPro ? [] : [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new ExtractTextPlugin('style.css'),
        new PrerenderSPAPlugin({
            // Required - The path to the webpack-outputted app to prerender
            staticDir: path.join(__dirname),

            // Optional - The path your rendered app should be output to.
            outputDir: path.join(__dirname, '.dist'),

            // Required - Routes to render
            routes: ['/'],

            // Optional - Minification
            // minify: {
            //     collapseBooleanAttributes: true,
            //     collapseWhitespace: true,
            //     decodeEntities: true,
            //     keepClosingSlash: true,
            //     sortAttributes: true
            // },

            // The actual renderer to use
            renderer: new Renderer({
                renderAfterDocumentEvent: 'render-event'
            })
        })
    ]
}
