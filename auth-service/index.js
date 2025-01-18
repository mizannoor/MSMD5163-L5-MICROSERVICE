import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import auth from "./auth.js";
import config from "./config.js";
import User from "./user.js";

dotenv.config();

const app = express();
mongoose
	.connect(process.env.DB_URI)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("MongoDB connection error:", err));

const authMiddleware = auth();
app.use(authMiddleware.initialize());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.PORT || 8080;

const router = express.Router();
router.get("/", (req, res) => {
	return res.json({ message: "Hula! my API works!!!" });
});

router.post("/register", async (req, res) => {
	try {
		const newUser = new User();
		newUser.email = req.body.email;
		newUser.password = req.body.password;

		await newUser.save();
		return res.json({ message: "User successfully registered." });
	} catch (err) {
		return res.json({ error: "Message: " + err });
	}
});

router.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) return res.status(404).json({ message: "User not found!" });

		user.verifyPassword(req.body.password, (err, isMatch) => {
			if (err) return res.status(500).json({ message: "Something is wrong" });

			if (!isMatch) {
				return res.status(401).json({ message: "Wrong password" });
			} else {
				const token = jwt.sign(user.toJSON(), config.secret, { expiresIn: 10080 });
				return res.status(200).json({ message: "Success", token: "JWT: " + token });
			}
		});
	} catch (err) {
		return res.status(500).json({ message: "An error occurred: " + err.message });
	}
});

router.post("/verify-token", async (req, res) => {
	const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header
	if (!token) {
		res.json({
			success: false,
			message: "No token provided",
		});
	} else {
		jwt.verify(token, config.secret, async (err, decoded) => {
			if (err) {
				res.json({
					success: false,
					message: "Failed to authenticate token",
				});
			} else {
				res.json({
					success: true,
					message: "Token is valid",
					user: decoded,
				});
			}
		});
	}
});

app.use("/api", router);

app.listen(port, () => {
	console.log(`Magic happens at port ${port}`);
});
