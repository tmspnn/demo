module.exports = function pageController(router) {
    router.get("/", async (ctx) => {
        const data = {
            pageTitle: "Home",
            aaa: "aaa blublublu~~~",
            tagsInHead: [`<link rel="stylesheet" href="index-1.0.0.css">`],
            tagsInBody: [`<script src="index-1.0.0.js"></script>`]
        };
        await ctx.render("pages/index/index.html", data);
    });
};
