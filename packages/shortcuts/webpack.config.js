const path = require('path');


module.exports = {
  entry: {
    index: './src/index',
  },

  output: {
    filename: 'shortcuts-[hash:5].js',
    path: path.resolve(__dirname, '../../docs/rsrc/dist'),
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },

  // module: {
  //   loaders: [
  //     { test: /\.json$/, loader: 'json-loader' },
  //     { test: /\.jsx$/, loader: 'jsx-loader?harmony' }
  //   ]
  // },

  // externals: {
  //   'd3': 'd3',
  // },
};
