#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const cwd = process.cwd();

console.log('cwd', cwd);
console.log('dirname', __dirname);

const run = function (view, outputPath) {
    const viewPath = path.resolve(cwd, view);
    if (!outputPath) {
        outputPath = viewPath;
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
            .replace('path/to/target', './' + targetPath.replace(/\\/g, '\\\\')),
        'utf8'
    );

    execSync('npm run build', {
        cwd: __dirname,
        stdio: [0, 1, 2]
    });

    const htmlResult = fs.readFileSync(path.resolve(__dirname, './.dist/index.html'), 'utf8').match(/(?:<!--\sTEMPLATE_BEGIN\s-->)([\s\S]*?)(?:<!--\sTEMPLATE_END\s-->)/);
    if (!htmlResult) return {};
    const htmlContent = htmlResult[1].trim();
    const cssContent = fs.readFileSync(path.resolve(__dirname, './.dist/style.css'), 'utf8');
    fs.writeFileSync(path.resolve(outputPath, './index.html'), htmlContent, 'utf8');
    fs.writeFileSync(path.resolve(outputPath, './index.css'), cssContent, 'utf8');
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

    run(options.viewPath, options.outputPath);
}

module.exports = run;
