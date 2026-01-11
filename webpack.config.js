const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-react',
                {
                  development: true,
                },
              ],
              '@babel/preset-env',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  devServer: {
    port: 3456,
    allowedHosts: ['all', '.alibaba-inc.com'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
    }),
    // 支持环境变量文件
    new Dotenv({
      path: `.env.${process.env.NODE_ENV || 'development'}`,
      safe: false,
      defaults: false,
      systemvars: true, // 允许系统环境变量覆盖
    }),
    // 将环境变量注入到代码中（DefinePlugin会在构建时替换代码中的变量）
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.REACT_APP_ENV': JSON.stringify(process.env.REACT_APP_ENV || undefined),
      'process.env.REACT_APP_API_BASE_URL': JSON.stringify(process.env.REACT_APP_API_BASE_URL || undefined),
      'process.env.REACT_APP_STAGING_API_URL': JSON.stringify(process.env.REACT_APP_STAGING_API_URL || undefined),
      'process.env.REACT_APP_PRODUCTION_API_URL': JSON.stringify(process.env.REACT_APP_PRODUCTION_API_URL || undefined),
      'process.env.REACT_APP_DEPLOY_ENV': JSON.stringify(process.env.REACT_APP_DEPLOY_ENV || undefined),
    }),
  ],
};
