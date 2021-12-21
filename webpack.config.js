const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    mode: 'production', //puede ser una var de amb
    entry: './src/index.ts',

    target:'node',
    externals: [nodeExternals()], //permite funcionamineto con lib externas

    output: {
        path: path.resolve(__dirname, 'dist'), //salida del compilador
        filename: 'main.js'
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    }
}