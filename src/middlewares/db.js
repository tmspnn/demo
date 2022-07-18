/**
 * Before using the connection pool, we have to set the environment variables:
 * PGUSER, PGHOST, PGPASSWORD, PGDATABASE, PGPORT
 */
import { Pool } from "pg";

const pool = new Pool();
let client = null;

export const db = {
	async query(...args) {
		client = await pool.connect();

		try {
			return await client.query(...args);
		} finally {
			client.release();
		}
	}
};

export default async function (ctx, next) {
	ctx.db = db;
	await next();
}
