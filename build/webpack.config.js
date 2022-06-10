'use strict'

const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const sass = require('sass')

const webpack = require('webpack')

const path = require('path')
const projectRoot = process.cwd()

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    library: 'AlignmentEditor',
    libraryTarget: 'window',
    filename: 'alpheios-alignment-editor.js',
    path: path.resolve(projectRoot, 'public/dist')
  },
  resolve: {
    alias: {
      'vue': '@vue/runtime-dom',
      '@': path.join(projectRoot, 'src'),
      'alpheios-client-adapters': path.join(projectRoot, '/node_modules/alpheios-core/packages/client-adapters/dist/alpheios-client-adapters.min.js'),
      'alpheios-data-models': path.join(projectRoot, '/node_modules/alpheios-core/packages/data-models/dist/alpheios-data-models.min.js'),
      'alpheios-l10n': path.join(projectRoot, '/node_modules/alpheios-core/packages/l10n/dist/alpheios-l10n.min.js')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]'
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: sass,
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.svg$/,
        use: [
          'vue-loader',
          {
            loader: 'vue-svg-loader', // `vue-svg` for webpack 1.x
            options: {
              // optional [svgo](https://github.com/svg/svgo) options
              svgo: {
                plugins: [
                  {removeDoctype: true},
                  {removeComments: true},
                  {inlineStyles: false}
                ]
              }
            }
          }
        ]

        
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style/style-alignment-editor.css'
    })
  ],
  devServer: {
    static: {
      directory: path.resolve(projectRoot, 'public'),
    },
    compress: true,
    port: 9000
  }
}