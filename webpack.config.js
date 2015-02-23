module.exports = {
  entry: {
    resume: './src/resume/index.jsx'
  },
  output: {
    filename: './js/[name].min.js'
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.jsx$/, loader: 'jsx-loader?harmony' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  }
};
