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

const run = async function (view, outputPath) {
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

    execSync('npm run build', {
        cwd: __dirname,
        stdio: [0, 1, 2]
    });

    const htmlPath = path.resolve(__dirname, './.dist/index.html');
    const cssPath = path.resolve(__dirname, './.dist/style.css');
    const htmlFile = fs.readFileSync(htmlPath, 'utf8');
    const htmlResult = htmlFile.match(/(?:<!--\sTEMPLATE_BEGIN\s-->)([\s\S]*?)(?:<!--\sTEMPLATE_END\s-->)/);
    if (!htmlResult) return {};
    const htmlContent = htmlResult[1].trim();
    const cssContent = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';
    fs.writeFileSync(path.resolve(outputPath, './index.html'), htmlContent, 'utf8');
    cssContent !== '' && fs.writeFileSync(path.resolve(outputPath, './index.css'), cssContent, 'utf8');
    return {
        html: htmlContent,
        css: cssContent
    };
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
