const path = require('path');
const webpack = require('webpack');

const isProduction = !!(process.env.NODE_ENV === 'production');
const jsPath = path.resolve(__dirname, 'src');

module.exports = {
  entry: [
    './src/client/client.js'
  ],
  output: {
    filename: './static/client.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        // http://stackoverflow.com/questions/29548386/how-should-i-use-moment-timezone-with-webpack
        include: /\.json$/,
        loaders: ['json-loader']
      },
      {
        loader: 'babel-loader',

        // skip any files outside of your project's `src` directory
        include: [ jsPath ],

        // ignore just node_modules... if you're being lazy about it
        // exclude: [ path.resolve(__dirname, "node_modules") ],

        // only run `.js` and `.jsx` files through Babel
        test: /\.jsx?$/,

        // babel configuration
        query: {
          presets: [
            [ 'env', { targets: { browsers: [ 'last 2 versions', 'safari 7' ] } } ]
          ],
          plugins: ['transform-react-jsx', 'transform-async-to-generator']
        }
      }
    ]
  },

  // http://stackoverflow.com/questions/29548386/how-should-i-use-moment-timezone-with-webpack
  // https://webpack.js.org/guides/migrating/
  resolve: {
    extensions: ['.json', '.jsx', '.js']
  },

  // minimize in production, leave as is in development
  plugins: isProduction ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ] : [],

  // Watch in development, run once in production
  watch: !isProduction
};
