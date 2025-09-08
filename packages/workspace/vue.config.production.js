const ElementImporter = require('unplugin-vue-components/webpack');
const { ElementUiResolver } = require('unplugin-vue-components/resolvers');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {
  outputDir: '.dist/workspace/rsrc/dist',
  publicPath: '/workspace/rsrc/dist/',

  configureWebpack: {
    plugins: [
      new WebpackManifestPlugin({ fileName: 'asset-manifest.json', publicPath: '' }),
      // new BundleAnalyzerPlugin({ openAnalyzer: false }),
    ],
  },

  chainWebpack: (config) => {
    config.output
      .filename('[name]-[chunkhash:5].js')
      .chunkFilename('[name]-[chunkhash:5].js');

    config.optimization.delete('splitChunks');
    // config.optimization.set('minimize', false);
    config.optimization.splitChunks({
      cacheGroups: {
        vue: {
          name: 'vendors-vue',
          test: /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/,
          priority: -10,
          chunks: 'initial',
        },
        umi: {
          name: 'vendors-umi',
          test: /[\\/]node_modules[\\/](axios)[\\/]/,
          priority: -11,
          chunks: 'initial',
        },
        default: {},
        vendors: {},
      },
    });

    config.plugin('element-importer').use(ElementImporter({
      resolvers: [
        ElementUiResolver(),
      ],
    }));

    config.plugin('html-umi').tap((args) => {
      const options = args[0];
      options.minify = false;
      // options.minify.maxLineLength = 120;
      options.inject = false;
      // console.log(options);
      options.headScripts = [
        [ '<script id="head-js">', '/* @head.js/head.js-init 0.0.0 */', '/* @head.js/head.js-profile 0.0.0 */', '</script>' ].join('\n'),
        [ '<script id="umi-js">', '/* @head.js/umi.js-init 0.0.0 */', '</script>' ].join('\n'),
      ];
      return args;
    });

    config.plugin('extract-css').tap((args) => {
      const options = args[0];
      options.filename = '[name]-[chunkhash:5].css';
      options.chunkFilename = '[name]-[chunkhash:5].css';
      return args;
    });
  },


  productionSourceMap: false,
};
