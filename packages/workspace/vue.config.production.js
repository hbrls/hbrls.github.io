const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const ElementImporter = require('unplugin-vue-components/webpack');
const { ElementUiResolver } = require('unplugin-vue-components/resolvers');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { version: ver } = require('./package.json');


const HEAD_PRESET = fs.readFileSync(path.resolve(process.cwd(), 'node_modules/@head.js/snippet/preset-head-b913f191e1.js'), 'utf-8');
const BODY_PRESET = fs.readFileSync(path.resolve(process.cwd(), 'node_modules/@head.js/snippet/preset-body-6d4da26fd6.js'), 'utf-8');

const GIT_HEAD = execSync('git rev-parse --short HEAD').toString().trim();


function _findBuild(js) {
  const REG_CACHED_CORE = /vendors-core-([0-9a-z]+).js/;
  const REG_CACHED_ENTRY = /umi-([0-9a-z]+).js/;
  let buildCore = '';
  let buildEntry = '';
  js.forEach((j) => {
    const [ _0, core ] = j.match(REG_CACHED_CORE) ?? [];
    if (core) {
      buildCore = core;
    }
    const [ _1, entry ] = j.match(REG_CACHED_ENTRY) ?? [];
    if (entry) {
      buildEntry = entry;
    }
  });
  return `${buildCore}.${buildEntry}`;
}


class HeadUmiPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('HeadUmiPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync('HeadUmiPlugin', (data, callback) => {
          // console.log(compiler.options);
          const { assets } = data;
          const build = _findBuild(assets.js);

          const mode = compiler.options.mode || process.env.NODE_ENV || 'undefined';
          const profile = process.env.WEB_STARTER_PROFILE_ACTIVE || 'undefined';
          const version = `${ver}.${GIT_HEAD}.${build}`;
          const context = '/workspace';

          const headScripts = HEAD_PRESET
            .replace('{{ __mode__ }}', mode)
            .replace('{{ __profile__ }}', profile)
            .replace('{{ __version__ }}', version)
            .replace('{{ __context__ }}', context);

          assets.headScripts = `<script id="head-js">\n${headScripts}\n</script>`;
          assets.bridgeScripts = `<script id="head-bridge-js">\n${BODY_PRESET}\n</script>`;
          callback(null, data);
        },
      );
    });
  }
}


module.exports = {
  outputDir: '.dist/workspace/rsrc/dist',
  publicPath: '/workspace/rsrc/dist/',

  configureWebpack: {
    plugins: [
      new WebpackManifestPlugin({ fileName: 'asset-manifest.json', publicPath: '' }),
      new HeadUmiPlugin(),
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
