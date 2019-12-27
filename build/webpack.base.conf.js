'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const entry = require('./entry')
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const WebpackSpritesmithPlugin = require('webpack-spritesmith')
const myTemplates = require('./customTemplate');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: process.env.NODE_ENV === 'production' ? entry.build : entry.dev,
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  externals: {
    'AMap': 'AMap',
    'AMapUI': 'AMapUI',
    'echarts': 'echarts',
    'vue': 'Vue',
    'vuex': 'Vuex',
    'vue-router': 'VueRouter',
    'axios':'axios'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          transformAssetUrls:{
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: ['xlink:href', 'href'],
            use: ['xlink:href', 'href']
          }
        }
      },
      {
        test: /\.js$/,
        //把对.js 的文件处理交给id为happyBabel 的HappyPack 的实例执行
        loader: 'happypack/loader?id=happyBabel',
        //排除node_modules 目录下的文件
        exclude: /node_modules/
      },
      // {
      //   test: /\.js$/,
      //   loader: 'babel-loader',
      //   include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      // },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 3000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new HappyPack({
        //用id来标识 happypack处理那里类文件
      id: 'happyBabel',
      //如何处理  用法和loader 的配置一样
      loaders: [{
        loader: 'babel-loader?cacheDirectory=true',
      }],
      //共享进程池
      threadPool: happyThreadPool,
      //允许 HappyPack 输出日志
      verbose: true,
    }),
    new VueLoaderPlugin(),
    new WebpackSpritesmithPlugin({
      src: {
        cwd: path.join(__dirname, '../src/assets/img'),
        glob: '**/*.png'
      },
      target: {
        image: path.join(__dirname, '../src/assets/sprites/ccba.png'),
        css: [[path.join(__dirname, '../src/assets/sprites/ccba.css'),{
          format:'custom_format' }]]
      },
      apiOptions: {
        cssImageRef: './ccba.png'
      },
      spritesmithOptions: {
        algorithm: 'binary-tree',
        padding: 5
      },
      customTemplates: {
        'custom_format': myTemplates.customFormat,
      }
    }),
    new WebpackSpritesmithPlugin({
      src: {
        cwd: path.join(__dirname, '../src/assets/www-img'),
        glob: '**/*.png'
      },
      target: {
        image: path.join(__dirname, '../src/assets/sprites/www.png'),
        css: path.join(__dirname, '../src/assets/sprites/www.css')
      },
      apiOptions: {
        cssImageRef: './www.png'
      },
      spritesmithOptions: {
        algorithm: 'binary-tree',
        padding: 5
      }
    })
  ],
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
