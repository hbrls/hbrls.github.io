const execSync = require('child_process').execSync;
const ElementImporter = require('unplugin-vue-components/webpack');
const { ElementUiResolver } = require('unplugin-vue-components/resolvers');
const WebpackPluginHeadUmi = require('@head.js/webpack-plugin-umi/dist/html.cjs');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { version: ver } = require('./package.json');


const GIT_HEAD = execSync('git rev-parse --short HEAD').toString().trim();

const VERSION = `${ver}.${GIT_HEAD}`;


module.exports = {
  outputDir: '.dist/workspace/rsrc/dist',
  publicPath: '/workspace/rsrc/dist/',

  configureWebpack: {
    plugins: [
      new WebpackManifestPlugin({ fileName: 'asset-manifest.json', publicPath: '' }),
      new WebpackPluginHeadUmi({ version: VERSION }),
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
          name: 'vendors-core',
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

    config.plugin('extract-css').tap((args) => {
      const options = args[0];
      options.filename = '[name]-[chunkhash:5].css';
      options.chunkFilename = '[name]-[chunkhash:5].css';
      return args;
    });

    config.plugin('html-umi').tap((args) => {
      const options = args[0];
      options.minify = false;
      // options.minify.maxLineLength = 120;
      options.inject = false;
      // console.log(options);
      options.headScripts = [
        [ '<script id="umi-js">', '/* @head.js/umi.js-init 0.0.0 */', '</script>' ].join('\n'),
      ];
      return args;
    });
  },


  productionSourceMap: false,
};
