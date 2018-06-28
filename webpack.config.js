const path = require('path');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  entry: {
    app: "./raw_assets/ts/index.ts",
    sw: "./raw_assets/ts/service-worker.ts"
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public')
  },
  plugins: [
    // new WorkboxPlugin.GenerateSW()
  ]
};