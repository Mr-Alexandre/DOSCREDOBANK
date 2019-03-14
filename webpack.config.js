const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = (env, argv) => ({
    // entry: './src/index.js',
    // output: {
    //     filename: 'index.js',
    //     path: path.resolve(__dirname, './dist'),
    //     publicPath: 'dist/'
    // },
    devServer: {
        // index: '../index.html',
        port: 8080,
        open: true,
        hot: true,
        overlay: {
            warnings: true,
            errors: true
        },
        // contentBase: path.join(__dirname, './src'),
        // inline: true,
        // progress: true,
        // compress: true,
        
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.pug$/,
                // include: path.resolve(__dirname, 'src/'),
                use:  [
                    // 'html-loader',
                    {
                        loader: 'html-loader',
                        options: {
                            attrs: ['img:src', ':src']
                        }
                    },
                    {
                        loader: 'pug-html-loader',
                        query: { 
                            pretty: true
                        } 
                    }
                ]
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
                    {
                        loader: "css-loader",
                        options: {
                            // url: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer({
                                    browsers:['ie >= 9', 'last 4 version']
                                })
                            ]
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'font/'
                    }
                }]
            },
            {
                test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'img',
                            useRelativePath: true,
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.pug',
            filename: './index.html',
            inject: true
        }),
        new MiniCssExtractPlugin({
            filename: "index.css"
        }),
        new CopyWebpackPlugin([
            
        ])
    ],
    devtool: argv.mode === 'production' ? 'source-map' : 'eval-sourcemap'
});