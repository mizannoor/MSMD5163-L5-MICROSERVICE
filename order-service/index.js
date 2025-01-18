import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import db from "./models/index.js"; // Import the ESM-compatible models/index.js
// import Order from "./models/order.js"; // Sequelize Order model
import configData from "./config/config.json" assert { type: "json" };

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());

// Load database configuration dynamically
const env = process.env.NODE_ENV || "development";
const config = configData[env];

// Create a Sequelize instance with configuration from config.json
/* const sequelize = new Sequelize(config.database, config.username, config.password, {
	host: config.host,
	dialect: config.dialect,
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
}); */

// Function to check if MySQL connection is successful
const checkConnection = async () => {
	try {
		await db.sequelize.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
};

// Call the function to check the connection
await checkConnection();

// Middleware to verify JWT by sending a request to auth-service
const verifyToken = async (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1]; // Extract token from the Authorization header

	if (!token) {
		return res.status(401).json({ error: "Unauthorized: No token provided" });
	}

	try {
		const response = await axios.post(
			"http://localhost:8080/api/verify-token",
			{}, // No body needed
			{
				headers: {
					Authorization: `Bearer ${token}`, // Add token to header
				},
			}
		);
		console.log("response.data :>> ", response.data);
		req.user = response.data.user; // Assuming the auth-service returns the user in its response
		next();
	} catch (error) {
		console.error("Error verifying token:", error.response?.data || error.message);
		return res.status(401).json({ error: "Unauthorized: Token verification failed" });
	}
};

// Create Order
app.post("/orders", verifyToken, async (req, res) => {
	console.log("Order creation request received:", req.body, "from user:", req.user);

	if (!req.body.bookId) {
		return res.status(400).json({ error: "bookId is required" });
	}

	const bookId = req.body.bookId;

	try {
		const bookServiceUrl = "http://localhost:5000"; // Replace with your book service URL
		const response = await axios.get(`${bookServiceUrl}/books/${bookId}`, {
			headers: {
				Authorization: `Bearer ${req.headers.authorization}`, // Forward the token from the request header
			},
		});

		console.log("Book Service Response:", response.data);

		if (response.status !== 200) {
			return res.status(404).json({ error: "Book not found" });
		}

		const book = response.data;

		const order = await db.Order.create({
			userId: req.user._id,
			bookId: bookId,
			quantity: req.body.quantity,
			status: "pending",
			bookName: book.name || book.title,
			bookIsbn: book.isbn,
			createdAt: new Date(),
		});

		console.log("Order Created Successfully:", order);
		res.status(201).json(order);
	} catch (error) {
		console.error("Order Creation Error:", error);
		res.status(500).json({ error: "Failed to create order", details: error.message });
	}
});

// Get All Orders for the Authenticated User
app.get("/orders", verifyToken, async (req, res) => {
	try {
		console.log("Authenticated user:", req.user); // Debugging

		// Fetch orders for the authenticated user
		const orders = await Order.findAll({
			where: { userId: req.user._id },
		});

		console.log("Fetched orders for user:", req.user._id); // Debugging
		console.log("Orders data:", orders); // Debugging

		res.status(200).json(orders);
	} catch (error) {
		console.error("Error fetching orders:", error); // Debugging
		res.status(500).json({ error: "Failed to fetch orders", details: error.message });
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Order service running on port ${PORT}`);
});
