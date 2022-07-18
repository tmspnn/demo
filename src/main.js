import path from "node:path";
import process from "node:process";
import cors from "@koa/cors";
import Router from "@koa/router";
import Koa from "koa";
import koaBody from "koa-body";
import helmet from "koa-helmet";
import ip from "koa-ip";
import send from "koa-send";
import pkgJSON from "../package.json" assert { type: "json" };
import exceptionHandler from "./middlewares/exceptionHandler.js";
import redisClient from "./middlewares/redisClient";
import db from "./middlewares/db";
import pageController from "./controllers/pageController.js";

const isProduction = process.env.NODE_ENV == "production";
const pwd = process.cwd();
const version = pkgJSON.version;
const app = new Koa();
const router = new Router();

pageController(router);

app.use(exceptionHandler({ isProduction, pwd, version }))
	.use(ip({ blacklist: [] }))
	.use(helmet())
	.use(cors())
	.use(koaBody())
	.use(redisClient)
	.use(db)
	.use(router.routes())
	.use(router.allowedMethods())
	.use(async (ctx) => {
		await send(ctx, ctx.path, {
			root: pwd + "/static"
		});
	})
	.listen(3000);

console.log("--> Server is listening at port 3000 <--");
