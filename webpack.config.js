const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const dev = process.env.NODE_ENV === 'dev'

let cssLoaders = [
	{
		loader: 'css-loader', options: {importLoaders: 1, minimize: !dev}
	},
	{
		loader: 'postcss-loader',
		options: {
			plugins: (loader) => [
			require('autoprefixer')({
				browsers: ['last 2 versions']
			})
			]
		}
	}
]

let config = {

	entry: './app/app.js',

	output: {
		publicPath: './dist/',
		path: path.resolve('./dist'),
		filename: 'bundle.js'
	},

	watch:dev,
	devtool: dev ? "cheap-module-eval-source-map" : "source-map",

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: ['babel-loader']
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
          			use: cssLoaders
				})	
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
          			use: [...cssLoaders, "sass-loader"]
				})			
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'file-loader'
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				use: [
				{
					loader: 'url-loader',
					options: {
						limit: 8192,
						name: '[name].[hash:7].[ext]'
					}
				}, 
				{
					loader: 'img-loader',
					options: {
						enabled: !dev
					}
				}
				]
			}
		]
	},
	plugins: [
		new ExtractTextPlugin({
			filename: 'app.css'
		})
	]

}

if(!dev) {
	config.plugins.push(new UglifyJsPlugin({
		sourceMap: true
	}))
}

module.exports = config