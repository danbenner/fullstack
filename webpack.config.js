const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '*'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  devServer: {
    port: 8081,
    historyApiFallback: {
      index: 'dist/assets/html/index.html',
    },
  },
  output: {
    path: path.join(__dirname, 'dist', 'assets', 'js'),
    publicPath: '/assets/js/',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, 'src')],
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: '../html/index.html',
      favicon: './src/js/images/favicon.ico',
    }),
  ],
};
