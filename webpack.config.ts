import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { Configuration as WebpackConfig } from "webpack";
import { Configuration as WebpackDevServerConfig } from "webpack-dev-server";

interface Configuration extends WebpackConfig {
    devServer?: WebpackDevServerConfig;
}

const rendererConfig: Configuration = {
    mode: process.env.NODE_ENV === "development" ? "development" : "production",
    entry: "./src/renderer/index.tsx",
    target: "web",
    output: {
        path: path.resolve(__dirname, "dist/renderer"),
        filename: "renderer.js",
        publicPath: "/",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                    options: {
                        transpileOnly: true,
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    "tailwindcss/nesting",
                                    "tailwindcss",
                                    "autoprefixer",
                                ],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: "asset/resource",
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src/renderer/index.html"),
        }),
        new MiniCssExtractPlugin({
            filename: "styles.css",
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, "dist/renderer"),
        },
        port: 3001,
        hot: true,
        historyApiFallback: true,
    },
};

const mainConfig: Configuration = {
    mode: process.env.NODE_ENV === "development" ? "development" : "production",
    entry: "./src/main/main.ts",
    target: "electron-main",
    output: {
        path: path.resolve(__dirname, "dist/main"),
        filename: "main.js",
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                    options: {
                        transpileOnly: true,
                    },
                },
            },
        ],
    },
};

const preloadConfig: Configuration = {
    mode: process.env.NODE_ENV === "development" ? "development" : "production",
    entry: "./src/main/preload.ts",
    target: "electron-preload",
    output: {
        path: path.resolve(__dirname, "dist/main"),
        filename: "preload.js",
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                    options: {
                        transpileOnly: true,
                    },
                },
            },
        ],
    },
};

export default [rendererConfig, mainConfig, preloadConfig]; 