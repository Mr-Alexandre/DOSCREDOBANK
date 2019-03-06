const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');

module.exports = (env, argv) => ({
    entry: './src/index.js',
    output: {
        filename: 'index.js'
    },
    devServer: {
        index: 'index.html',
        port: 8080,
        open: true,
        hot: true,
        overlay: {
            warnings: true,
            errors: true
        },
        contentBase: path.join(__dirname, './src'),
        // inline: true,
        // progress: true,
        // compress: true,
        
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                          minimize: true,
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    // 'style-loader',
                    // MiniCssExtractPlugin.loader,
                    argv.mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer({
                                    browsers:['ie >= 9', 'last 4 version']
                                })
                            ],
                            sourceMap: true
                        }
                    },
                    "sass-loader"
                ]
            },
            {
                test: /\.pug$/,
                include: path.resolve(__dirname, 'src/'),
                use:  [
                    'html-loader',
                    'pug-html-loader'
                    // 'pug-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.pug',
            inject: false
        }),
        new MiniCssExtractPlugin({
            filename: "index.css"
        })
    ]
});