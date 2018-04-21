#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

process.env.NODE_ENV = 'production';

const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

const cwd = process.cwd();

console.log('cwd', cwd);
console.log('dirname', __dirname);

const isFile = filepath => fs.statSync(filepath).isFile();
const isDir = filepath => fs.statSync(filepath).isDirectory();

const run = function (view, outputPath) {
    let viewPath = path.resolve(cwd, view);
    console.log('view', viewPath);
    if (isDir(viewPath)) {
        viewPath = path.resolve(viewPath, 'index.vue');
    }
    console.log('view', viewPath);
    if (!fs.existsSync(viewPath)) return Promise.reject('target not found');
    if (!outputPath) {
        outputPath = path.dirname(viewPath);
    } else {
        outputPath = path.resolve(cwd, outputPath);
    }
    console.log('view', viewPath);
    console.log('output', outputPath);
    const targetPath = path.relative(__dirname, viewPath);
    console.log('target', targetPath);
    fs.writeFileSync(
        path.resolve(__dirname, './main.js'),
        fs.readFileSync(path.resolve(__dirname, './main.template.js'), 'utf8')
            .replace('path/to/target', './' + targetPath.replace(/\\/g, '/')),
        'utf8'
    );

    return new Promise((resolve, reject) => {
        webpack({
            ...webpackConfig
        }, (err, stats) => {
            if (err || stats.hasErrors()) {
                return reject(err || stats);
            }
            setTimeout(() => {
                const htmlFile = fs.readFileSync(path.resolve(__dirname, './.dist/index.html'), 'utf8');
                const htmlResult = htmlFile.match(/(?:<!--\sTEMPLATE_BEGIN\s-->)([\s\S]*?)(?:<!--\sTEMPLATE_END\s-->)/);
                if (!htmlResult) return reject('html content not found');
                const htmlContent = htmlResult[1].trim();
                const cssContent = fs.readFileSync(path.resolve(__dirname, './.dist/style.css'), 'utf8');
                fs.writeFileSync(path.resolve(outputPath, './index.html'), htmlContent, 'utf8');
                fs.writeFileSync(path.resolve(outputPath, './index.css'), cssContent, 'utf8');
                resolve({
                    html: htmlContent,
                    css: cssContent
                });
            });
        }
    );
    });
};

if (require.main === module) {
    // Called directly
    const args = process.argv.slice(2);
    const options = {};
    args.forEach(function (val, index, array) {
        console.log(`${index}: ${val}`);
        switch (val) {
        case '-v':
            options.viewPath = args[index + 1];
            break;
        case '-o':
            options.outputPath = args[index + 1];
            break;
        }
    });

    run(options.viewPath, options.outputPath).catch(err => {
        // console.log(err);
    });
}

module.exports = run;
