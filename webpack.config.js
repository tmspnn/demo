import { readdirSync } from "node:fs";
import process from "node:process";
import _ from "lodash";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import pkgJSON from "./package.json" assert { type: "json" };

const isProduction = process.env.NODE_ENV == "production";
const pwd = process.cwd();
const version = pkgJSON.version;
const pageDirectories = readdirSync(pwd + "/src/views/pages");

export default {
	mode: isProduction ? "production" : "development",
	context: pwd + "/src/views",
	entry: _(pageDirectories)
		.keyBy()
		.mapValues((p) => `/pages/${p}/${p}.js`)
		.value(),
	output: {
		path: pwd + "/static",
		filename: `[name]-${version}.js`,
		publicPath: ""
	},
	module: {
		rules: [
			{
				test: /\.s?css$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
			}
		]
	},
	devtool: isProduction ? false : "eval-source-map",
	plugins: [
		...pageDirectories.map(
			() =>
				new MiniCssExtractPlugin({ filename: `[name]-${version}.css` })
		)
	]
};
