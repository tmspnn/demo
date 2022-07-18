import { createClient } from "redis";

/**
 * Will connect to localhost on port 6379.
 */
const client = createClient();

client.on("error", (err) =>
	console.error(
		"\n--> Redis Error <--\n",
		err.stack || error.message || err.toString(),
		"\n\n"
	)
);

await client.connect();

const subscriber = client.duplicate();

export const redisClient = {
	/**
	 * @param {string[]} args
	 */
	async call(...args) {
		return await client.sendCommand(args);
	},

	/**
	 * @param {string} channel
	 * @param {function(string message, string channel): void} handler
	 */
	async sub(channel, handler) {
		await subscriber.subscribe(channel, handler);
	},

	/**
	 * @param {string} channel
	 * @param {string} message
	 */
	async pub(channel, message) {
		await client.publish(channel, message);
	}
};

export default async function (ctx, next) {
	ctx.redis = redisClient;
	await next();
}
