import { Sequelize } from "sequelize";

export const config = {
	dialect: "mysql",
	username: process.env.DB_USER || "root",
	password: process.env.DB_PASSWORD || "local_dev_db2022",
	database: process.env.DB_NAME || "order_db",
	host: process.env.DB_HOST || "localhost",
};

export default config;
