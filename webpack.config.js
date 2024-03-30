const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require('terser-webpack-plugin');
const PACKAGE = require("./package.json");
const HtmlWebpackPlugin = require("html-webpack-plugin");
let LIBRARY_NAME = PACKAGE.name;
let VERSION = PACKAGE.version;
let mode = "production";
process.argv.forEach((value, index, array) => {
    if (value === "--mode") {
        mode = array[index + 1];
    }
});
let isDev = mode === "development";
let isProd = !isDev;
console.error("mode: " + mode);
console.error("isDev: " + isDev);
console.error("isProd: " + isProd);
console.error("LIBRARY_NAME: " + LIBRARY_NAME);
let PATHS = {
    dist: path.resolve(__dirname, "dist"),
    nodeModules: path.resolve(__dirname, "node_modules")
};
console.warn("PATHS.nodeModules: " + PATHS.nodeModules);

// Webpack config
const port = process.env.PORT ?? 9000;
const xApiVersion = process.env.X_API_VERSION;
if (!xApiVersion) {
    throw new Error("env.X_API_VERSION is not defined");
}
const credentials = process.env.CREDENTIALS;
if (!credentials) {
    throw new Error("env.CREDENTIALS is not defined");
}
const serverUrl = process.env.SERVER_URL;
if (!serverUrl) {
    throw new Error("env.SERVER_URL is not defined");
}
const serverType = process.env.SERVER_TYPE;
if (!serverType) {
    throw new Error("env.SERVER_TYPE is not defined");
}
const externalUserService = process.env.EXTERNAL_USER_SERVICE_URL;
if (!externalUserService) {
    throw new Error("env.EXTERNAL_USER_SERVICE_URL is not defined");
}
const buildType = process.env.BUILD_TYPE;
if (!buildType) {
    throw new Error("env.BUILD_TYPE is not defined");
}
console.log({
    buildType,
    version: PACKAGE.version,
    port,
    xApiVersion,
    credentials,
    serverUrl,
    serverType,
    externalUserService,
});
module.exports = {
    mode: mode,
    context: path.resolve("src"),
    entry: {
        ["main"]: ["./ProdMain.ts"],
        ["dev"]: ["./DevMain.ts"],
    },

    devtool: "source-map",
    output: {
        path: PATHS.dist,
        filename: "[name].[chunkhash].js",
        libraryTarget: "umd",
        library: LIBRARY_NAME,
        umdNamedDefine: true
    },
    optimization: {
        minimize: isProd,
        minimizer: [new TerserPlugin({
            include: /.js$/,
            terserOptions: {
                keep_classnames: true
            }
        }),],
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: "vendors",
                    test: /node_modules/,
                    chunks: "all",
                    enforce: true,
                }
            },
        },
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    module: {
        rules: [{
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        }, {
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }, {
            test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/fonts/'
                }
            }]
        }, {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"]
        }, {
            test: /(\.frag$)|(\.vert$)|(\.txt$)/,
            use: ["raw-loader"]
        }, {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
        },]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            "app": path.join(__dirname, ".", './src/'),
            "res": path.join(__dirname, ".", './resources/assets/'),
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: "./../resources/assets/favicon/favicon.png",
            cache: isProd,
            filename: "index.html",
            template: "./index.html",
            chunks: ["main"]
        }),
        new HtmlWebpackPlugin({
            favicon: "./../resources/assets/favicon/favicon.png",
            cache: isProd,
            filename: "dev.html",
            template: "./index.html",
            chunks: ["dev"]
        }),
        new webpack.DefinePlugin({
            __DEV__: isDev,
            X_API_VERSION: JSON.stringify(xApiVersion),
            CREDENTIALS: JSON.stringify(credentials),
            SERVER_URL: JSON.stringify(serverUrl),
            SERVER_TYPE: JSON.stringify(serverType),
            EXTERNAL_USER_SERVICE_URL: JSON.stringify(externalUserService),
            VERSION: JSON.stringify(VERSION),
            BUILD_TYPE: JSON.stringify(buildType),
        }),
    ],

    externals: [

    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: port,
    },
};
