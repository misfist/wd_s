'use strict';

const devMode = process.env.NODE_ENV !== 'production';

const webpack = require( 'webpack' );
const path = require( 'path' );
const CleanPlugin = require( 'clean-webpack-plugin' );
const StyleLintPlugin = require( 'stylelint-webpack-plugin' );
const SpritesmithPlugin = require( 'webpack-spritesmith' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const ImageminPlugin = require( 'imagemin-webpack-plugin' ).default;
const SpriteLoaderPlugin = require( 'svg-sprite-loader/plugin' );
const UglifyJsPlugin = require( 'uglifyjs-webpack-plugin' );
const ExtractCssChunks = require( 'extract-css-chunks-webpack-plugin' );
const WriteFilePlugin = require( 'write-file-webpack-plugin' );
const bourbon = require( 'bourbon' ).includePaths;
const neat = require( 'bourbon-neat' ).includePaths;

let webpackConfig = {

	entry: {
		main: './assets/scripts/index.js'
	},

	output: {
		filename: '[name].js',
		path: path.resolve( __dirname, './dist' ),
		publicPath: '/'
	},

	devServer: {
		port: 3000,
		proxy: {
			'*': {
				changeOrigin: true,
				target: 'http://wdunderscores.test/'
			}
		},
		open: true,
		hot: true
	},

	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'eslint-loader',
					options: {
						fix: false,
						failOnWarning: false,
						failonError: true
					}
				}
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|dist)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [ '@babel/preset-env' ]
					}
				}
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					ExtractCssChunks.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true
						}
					},
					{ loader: 'resolve-url-loader' },
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
							includePaths: [ bourbon, neat ]
						}
					}
				]
			},
			{
				test: /\.(jpg|png|gif|svg)$/,
				exclude: [
					/assets\/images\/svg-icons\/.*\.svg$/
				],
				use: [
					{
						loader: 'file-loader',
						options: {
							emitFile: false,
							name: '[path][name].[ext]',
							outputPath: '',
							publicPath: ''
						}
					}
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							emitFile: false,
							name: '[path][name].[ext]',
							outputPath: '',
							publicPath: ''
						}
					}
				]
			},
			{
				test: /assets\/images\/svg-icons\/.*\.svg$/,
				use: [
					{
						loader: 'svg-sprite-loader',
						options: {
							symbolId: 'icon-[name]',
							extract: true,
							spriteFilename: '../assets/images/svg-icons.svg'
						}
					},
					{
						loader: 'svgo-loader',
						options: {
							plugins: [
								{ removeTitle: true },
								{ removeAttrs: { attrs: [ 'path:fill', 'path:class' ] } }
							]
						}
					}
				]
			}
		]
	},
	optimization: {
		minimizer: [ new UglifyJsPlugin() ]
	},
	plugins: [
		new CleanPlugin( [ 'dist' ] ),
		new SpritesmithPlugin(
			{
				src: {
					cwd: path.resolve( __dirname, 'assets/images/sprites' ),
					glob: '*.png'
				},
				target: {
					image: path.resolve( __dirname, 'assets/images/sprites.png' ),
					css: path.resolve( __dirname, 'assets/sass/base/_sprites.scss' )
				},
				apiOptions: {
					cssImageRef: '~sprites.png'
				}
			}
		),
		new webpack.ProvidePlugin( {
			$: 'jquery',
			jQuery: 'jquery'
		} ),
		new ExtractCssChunks( {
			filename: 'style.css',
			chunkFilename: 'style.css',
			hot: devMode ? true : false
		} ),
		new SpriteLoaderPlugin( { plainSprite: true } ),
		new StyleLintPlugin( {
			configFile: './.stylelintrc',
			files: './assets/sass/**',
			syntax: 'scss'
		} ),
		new CopyWebpackPlugin(
			[
				{
					from: path.resolve( __dirname, 'assets/images/' ),
					to: path.resolve( __dirname, 'assets/images/' )
				}
			]
		),
		new ImageminPlugin(
			{
				pngquant: {
					optimizationLevel: 5
				}
			}
		)
	],

	devtool: 'source-map'
};

if ( devMode ) {
	webpackConfig.plugins.push( new webpack.HotModuleReplacementPlugin() );
	webpackConfig.plugins.push( new WriteFilePlugin( { test: /^(?!.*(hot)).*/ } ) );
}

module.exports = webpackConfig;