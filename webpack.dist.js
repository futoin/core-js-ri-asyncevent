'use strict';

const UglifyJsPlugin = require( 'uglifyjs-webpack-plugin' );
const package_json = require( './package' );

module.exports = [
    {
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
        plugins: [
            new UglifyJsPlugin( {
                sourceMap: true,
            } ),
        ],
    },
    {
        entry: {
            'polyfill-asyncevent': './lib/polyfill.js',
        },
        output: {
            filename: "[name].js",
            path: __dirname + '/dist',
        },
        node : false,
        plugins: [
            new UglifyJsPlugin( {
                sourceMap: true,
            } ),
        ],
    },
];
