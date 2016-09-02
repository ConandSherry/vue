var webpack = require('webpack');
var path = require('path');

var publicPath = 'http://localhost:3000/';
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

var devConfig = {
	entry: [path.resolve(__dirname, "./portal-ui/main.js"), hotMiddlewareScript],
	output: {
		filename: './dist/[name].js',
		path: path.resolve(__dirname, './portal-ui'),
		publicPath: publicPath
	},
	devtool: 'eval-source-map',
	module: {
		loaders: [{
			test: /\.vue$/,
			loader: 'vue'
		}, {
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: {
    	    	presets: ['es2015']
    		}
		}, {
			test: /\.json$/,
			loader: 'json'
		}, {
			test: /\.(png|jpg)$/,
			loader: 'url?limit=8192&context=client&name=[path][name].[ext]'
		}, {
			test: /\.scss$/,
			loader: 'style!css?sourceMap!resolve-url!sass?sourceMap'
		}]
	},
	plugins: [
		new webpack.ProvidePlugin({
			Cookies:'cookies-js',
			$: 'jquery',
			Vue: 'vue',
			_:'underscore'
		}),
		new webpack.DllReferencePlugin({
			context: __dirname,
			manifest: require('./manifest.json'),
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	]
};

module.exports = devConfig;