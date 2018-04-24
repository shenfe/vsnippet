const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const isPro = process.env.NODE_ENV === 'production'

const subDir = '.dist'

module.exports = {
    entry: './main.js',
    output: {
        path: path.resolve(__dirname, `./${subDir}`),
        publicPath: `/${subDir}/`,
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: isPro
                    ? ExtractTextPlugin.extract({
                        use: 'css-loader',
                        fallback: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
                    })
                    : ['vue-style-loader', 'css-loader']
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
                // exclude: /node_modules/
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
            vue$: 'vue/dist/vue.esm.js'
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
    plugins: !isPro
        ? []
        : [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            }),
            new ExtractTextPlugin('style.css'),
            new PrerenderSPAPlugin({
                // Required - The path to the webpack-outputted app to prerender
                staticDir: __dirname,

                // Optional - The path your rendered app should be output to.
                outputDir: path.resolve(__dirname, subDir),

                // Optional - The location of index.html
                indexPath: path.resolve(__dirname, 'index.html'),

                // Required - Routes to render
                routes: ['/'],

                // Optional - Minification
                minify: {
                    collapseBooleanAttributes: false,
                    collapseWhitespace: false,
                    decodeEntities: false,
                    keepClosingSlash: false,
                    sortAttributes: false
                },

                // The actual renderer to use
                renderer: new Renderer({
                    renderAfterDocumentEvent: 'render-event'
                })
            })
        ]
};
