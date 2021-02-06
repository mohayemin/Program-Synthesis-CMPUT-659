const path = require('path');

module.exports = {
  entry: './src/Main.ts',
  // devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'assignment1.js',
    path: path.resolve(__dirname, 'build'),
  },
};