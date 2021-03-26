//Internal modules
const fs = require("fs");
const path = require("path");

// External modules
const _ = require("lodash");
const cors = require("@koa/cors");
const dayjs = require("dayjs");
const Router = require("@koa/router");
const Koa = require("koa");
const koaBody = require("koa-body");
const helmet = require("koa-helmet");
const ip = require("koa-ip");
const views = require("koa-views");
const send = require("koa-send");

// Local modules
const pageController = require("./controllers/pageController");
const componentDirs = fs
    .readdirSync(__dirname + "/views/components")
    .filter((dirOrFile) => !_.includes(dirOrFile, "."));
const isProduction = process.env.NODE_ENV == "production";

const render = views(__dirname + "/views", {
    map: { html: "lodash" },
    options: {
        $: _(componentDirs)
            .keyBy()
            .mapValues((dir) => {
                const templatePath =
                    __dirname + `/views/components/${dir}/${dir}.html`;
                const html = fs.readFileSync(templatePath, {
                    encoding: "utf8"
                });
                return _.template(html);
            })
            .value(),
        cache: isProduction,
        dayjs
    }
});

async function handleException(ctx, next) {
    try {
        await next();
    } catch (e) {
        ctx.status = e.status || 500;
        ctx.body = {
            err: e.message,
            stack: isProduction ? null : e.stack
        };
    }
}

// Initialization
const app = new Koa();
const router = new Router();

pageController(router);

app.use(handleException)
    .use(ip({ blacklist: [] }))
    .use(helmet())
    .use(cors())
    .use(render)
    .use(koaBody())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(async (ctx) => {
        await send(ctx, ctx.path, {
            root: path.resolve(__dirname, "../assets")
        });
    });

app.listen(3000);
