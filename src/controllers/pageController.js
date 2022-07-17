import { readdirSync, readFileSync } from "node:fs";
import process from "node:process";
import _ from "lodash";
import ejs from "ejs";

const pwd = process.cwd();
const viewRoot = pwd + "/src/views";

const templateFn = _(readdirSync(viewRoot + "/pages"))
	.keyBy()
	.mapValues((p) => {
		const html = readFileSync(`${viewRoot}/pages/${p}/${p}.html`, {
			encoding: "utf8"
		});

		return ejs.compile(html, { root: viewRoot, rmWhitespace: true });
	})
	.value();

export default function pageController(router) {
	/**
	 * Homepage
	 */
	router.get("/", async (ctx) => {
		ctx.state.data = {
			pageTitle: "Homepage",
			nickname: "Thomas"
		};
		ctx.type = "text/html";
		ctx.body = templateFn.homepage(ctx.state);
	});
}
