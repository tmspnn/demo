module.exports = function pageController(router) {
    router.get("/", async (ctx) => {
        const data = {
            pageTitle: "Home",
            tagsInHead: [],
            tagsInBody: []
        };
        await ctx.render("pages/index/index.html", data);
    });
};
