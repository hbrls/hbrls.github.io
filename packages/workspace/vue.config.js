module.exports = () => {
  const commonConfig = {
    pages: {
      umi: {
        entry: 'src/index.js',
        template: 'src/document.ejs',
        filename: 'index.html',
      },
    },

    configureWebpack: {
      output: {
        libraryTarget: 'system',
      },

      module: {
        rules: [
          { parser: { system: false } },
        ],
      },
    },
  };

  let config = {};
  if (process.env.NODE_ENV === 'production') {
    config = require('./vue.config.production'); // eslint-disable-line global-require
  } else {
    config = require('./vue.config.development'); // eslint-disable-line global-require
  }

  return { ...commonConfig, ...config };
}
