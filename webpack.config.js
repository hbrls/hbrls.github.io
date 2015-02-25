module.exports = {
  entry: {
    portfolios: './src/portfolios/index.js',
    resume: './src/resume/index.jsx'
  },
  output: {
    filename: './[name]/js/[name].min.js'
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
