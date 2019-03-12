const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
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
                    argv.mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
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
                    'html-loader?attr=false',
                    {
                        loader: 'pug-html-loader',
                        query: { 
                            pretty: true
                        } 
                    }
                ]
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: '[name].[ext]',
                    }
                }]
            },
            {
                test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
                loader: "file-loader",
                options: {
                    name: '[name].[ext]',
                    outputPath: 'img',
                    useRelativePath: true,
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.pug',
            // inject: false
        }),
        new MiniCssExtractPlugin({
            filename: "index.css"
        }),
        new CopyWebpackPlugin(
            [
                {from: './src/font', to: 'font'},
                {from: './src/jquery-3.3.1.js', to: ''}
            ]
        )
    ]
});