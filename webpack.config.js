module.exports = {
  entry: {
    fe: './src/fe',
    // portfolios: './src/portfolios',
    // resume: './src/resume',
  },

  output: {
    filename: './static/dist/[name].min.js'
  },

  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.jsx$/, loader: 'jsx-loader?harmony' }
    ]
  },
  externals: {
    'd3': 'd3',
    'reveal': 'Reveal'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  }
};
