const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProduction = process.env.NODE_ENV === 'production';

const config = {

        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        },

        entry: __dirname + "/src/index.ts",

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'app.min.js'
        },

        module: {
            rules: [{
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
                exclude: /node_modules/,
                query: {
                    declaration: false,
                }
            }, {
                test: /\.(less|css)$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    'less-loader'
                ],
            }, {
                test: /\.(svg|eot|woff|ttf|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                },
            }]
        },

        plugins: [
            new MiniCssExtractPlugin()
        ]
    }
;

module.exports = config;