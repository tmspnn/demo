// Env & version
const isProduction = process.env.NODE_ENV == "production";
const version = require("./package.json").version;
const _ = require("lodash");

// Plugins
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");
const colorFunction = require("postcss-color-function");
const precss = require("precss");

// Pages
const pages = ["index"];

module.exports = {
    context: __dirname + "/src/views",
    entry: _(pages)
        .keyBy()
        .mapValues((p) => `/pages/${p}/${p}.js`)
        .value(),
    mode: isProduction ? "production" : "development",
    output: {
        path: __dirname + "/assets",
        filename: `[name]-${version}.js`,
        publicPath: "",
    },
    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: "css-loader", options: { importLoaders: 1 } },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        "postcss-import",
                                        {
                                            path: [
                                                __dirname + "/src/views/styles",
                                            ],
                                        },
                                    ],
                                    precss,
                                    colorFunction,
                                    autoprefixer,
                                ],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ["@babel/preset-env", { targets: "defaults" }],
                        ],
                        plugins: [
                            [
                                "@babel/plugin-proposal-class-properties",
                                { loose: true },
                            ],
                        ],
                    },
                },
            },
        ],
    },
    resolve: {
        alias: {
            "@components": __dirname + "/src/views/components",
            "@util": __dirname + "/src/views/util",
        },
        extensions: [".js", ".json"],
    },
    devtool: isProduction ? "nosources-source-map" : "cheap-module-source-map",
    plugins: [
        new webpack.ProvidePlugin({
            _: "lodash",
            View: ["@components/vc", "View"],
            Controller: ["@components/vc", "Controller"],
            isJSON: ["@util/isJSON", "default"],
            $: ["@util/DOM", "$"],
            $$: ["@util/DOM", "$$"],
            addClass: ["@util/DOM", "addClass"],
            removeClass: ["@util/DOM", "removeClass"],
            toggleClass: ["@util/DOM", "toggleClass"],
            hasClass: ["@util/DOM", "hasClass"],
            cloneNode: ["@util/DOM", "cloneNode"],
            replaceNode: ["@util/DOM", "replaceNode"],
            clearNode: ["@util/DOM", "clearNode"],
            html2DOM: ["@util/DOM", "html2DOM"],
        }),
        ...pages.map(
            () =>
                new MiniCssExtractPlugin({ filename: `[name]-${version}.css` })
        ),
    ],
    watchOptions: { ignored: ["node_modules/**"] },
};
