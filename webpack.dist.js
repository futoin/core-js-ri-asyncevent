'use strict';

const package_json = require( './package' );

module.exports = [
    {
        mode: 'production',
        entry: {
            'futoin-asyncevent': `./${package_json.browser}`,
        },
        output: {
            library: {
                root: "$asyncevent",
                amd: "futoin-asyncevent",
                commonjs: "futoin-asyncevent",
            },
            libraryTarget: "umd",
            filename: "[name].js",
            path: __dirname + '/dist',
        },
        node : false,
    },
    {
        mode: 'production',
        entry: {
            'polyfill-asyncevent': './lib/polyfill.js',
        },
        output: {
            filename: "[name].js",
            path: __dirname + '/dist',
        },
        node : false,
    },
];
