'use strict';

module.exports = {
    mode: 'development',
    entry: {
        unittest : './es5/test/unittest.js',
    },
    output: {
        filename: "[name].js",
        path: __dirname + '/dist',
        libraryTarget: "umd",
    },
    externals: {
        'futoin-asyncevent' : {
            root: "$asyncevent",
            amd: "futoin-asyncevent",
            commonjs: "futoin-asyncevent",
            commonjs2: "futoin-asyncevent",
        },
        chai : {
            root: "chai",
            amd: "chai",
            commonjs: "chai",
            commonjs2: "chai",
        },
        mocha : {
            root: "mocha",
            amd: "mocha",
            commonjs: "mocha",
            commonjs2: "mocha",
        },
    },
    node : false,
};
