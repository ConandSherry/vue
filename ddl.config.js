const webpack = require('webpack');

const vendors = [
	'bootstrap',
	'jquery',
    'vue',
    'vuex',
    'vue-i18n',
    'vue-resource',
    'vue-router',
    'vue-validator',
    'underscore',
    'cookies-js'
];

module.exports = {
    output: {
        path: 'portal-ui/dist',
        filename: '[name].js',
        library: '[name]',
    },
    entry: {
        "lib": vendors,
    },
    plugins: [
    	new webpack.ProvidePlugin({
			jQuery: 'jquery'
		}),
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: '[name]',
            context: __dirname,
        })
    ],
};