import process from "node:process";

process.on("uncaughtException", (e) => {
	console.error(
		"\n--> uncaughtException <--\n",
		e.stack || e.message || e.toString(),
		"\n\n"
	);
	process.exit(1);
});

/**
 * @param {Object} options
 * @param {boolean} options.isProduction
 * @param {string} options.pwd
 * @param {string} options.version
 */
export default function (options) {
	return async function (ctx, next) {
		try {
			ctx.state.isProduction = options.isProduction;
			ctx.state.pwd = options.pwd;
			ctx.state.version = options.version;
			await next();
		} catch (e) {
			console.error(
				"\n--> Error <--\n",
				e.stack || e.message || e.toString(),
				"\n\n"
			);
			ctx.status = e.status || 500;
			ctx.body = {
				err: e.message,
				stack: options.isProduction ? undefined : e.stack
			};
		}
	};
}
