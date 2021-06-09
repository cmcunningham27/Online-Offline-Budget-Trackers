const WebpackPwaManifest = require('webpack=pwa-manifest');
const path = require('path');

const config = {
    entry: './public/index.js',
    output: {
        path: __dirname + '/public/dist',
        filename: 'bundle.js'
    },
    mode: 'development',
    plugins: [
        new WebpackPwaManifest({
            filename: 'manifest.webmanifest',
            inject: false,
            fingerprints: false,
            name: 'Online/Offline Budget Tracker',
            short_name: 'Budget Tracker App',
            description: 'An application for tracking budget when online and offline',
            orientation: 'portrait',
            background_color: '#FFFFFF',
            theme_color: '#FFFFFF',
            start_url: '/',
            display: 'standalone',
            icons: [
                {
                    src: path.resolve('public/icons/icon-192x192.png'),
                    sizes: [192, 512],
                    destination: path.join('assets', 'icons')
                }
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preser-env']
                    }
                }
            }
        ]
    }
};

module.exports = config;