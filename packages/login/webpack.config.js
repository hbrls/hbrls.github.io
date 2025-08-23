const path = require('path');
const Config = require('webpack-chain');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


const config = new Config();

config.mode('production');

config.entry('umi')
  .add('./src/index.tsx')
  .end();

config.output
  .path(path.resolve('../../docs/rsrc/dist'))
  .filename('login-[name]-[contenthash:5].js')
  .publicPath('/rsrc/dist/');

config.resolve.extensions
  .add('.js')
  .add('.jsx')
  .add('.json')
  .add('.tsx');


config.module
	.rule('js')
		.test(/\.(js|jsx|ts|tsx)$/)
    .exclude.add(/node_modules/).end();
config.module
  .rule('js')
    .use('babel-loader').loader('babel-loader');


config.module
  .rule('css')
    .test(/\.css$/)
    .exclude.add(/node_modules/).end();
config.module
  .rule('css')
    .use('style-loader').loader('style-loader');
config.module
  .rule('css')
    .use('css-loader').loader('css-loader');
config.module
  .rule('css')
    .use('postcss-loader').loader('postcss-loader')
    .options({
      postcssOptions: {
        plugins: [
          'postcss-preset-env',
          'tailwindcss',
        ]
      },
    });


config.optimization.set('chunkIds', 'named');

// config.optimization.set('runtimeChunk', true);
config.optimization.set('splitChunks', {
  chunks: 'async',
  // minSize: 0,
  cacheGroups: {
    default: false,
    defaultVendors: false,
    react: {
      name: 'vendors-react',
      chunks: 'initial',
      minChunks: 1,
      test: /[\\/]node_modules[\\/](axios|react|react-dom)[\\/]/,
      priority: -10,
    },
  }
});

config.optimization.set('minimize', true);

config.plugin('eslint')
  .use(ESLintPlugin, [{
    extensions: ['js', 'jsx', 'ts', 'tsx'],
    emitWarning: true,
    emitError: true,
    failOnError: true,
  }]);

config.plugin('stylelint')
  .use(StylelintPlugin, [{
    files: ['**/*.css'],
    emitWarning: true,
    emitError: true,
    failOnError: true,
  }]);

// config.plugin('bundle-analyzer').use(BundleAnalyzerPlugin).init(Plugin => new Plugin());

const conf = config.toConfig();
// console.log(conf);

module.exports = conf;
