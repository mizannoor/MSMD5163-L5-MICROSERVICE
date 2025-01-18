import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import Book from "./book.js";
import authenticateToken from './authMiddleware.js';

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(bodyParser.json());

// MongoDB connection
mongoose
	.connect(process.env.DB_URI)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("MongoDB connection error:", err));

// Router for the book service
const router = express.Router();
router.get("/", (req, res) => {
	return res.json({ message: "Book service works!!!" });
});
app.use("/", router);

// CRUD routes for books
/* router.post("/books", async (req, res) => {
	try {
		const book = new Book(req.body);
		const savedBook = await book.save();
		return res.status(201).json(savedBook);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
}); */
router.post('/books', authenticateToken, async (req, res) => {
    try {
        const book = new Book(req.body);
        const savedBook = await book.save();
        res.status(201).json(savedBook);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/books", async (req, res) => {
	try {
		const books = await Book.find();
		return res.json(books);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

router.get("/books/:id", async (req, res) => {
	try {
		const book = await Book.findById(req.params.id);
		if (!book) return res.status(404).json({ message: `Book ${req.params.id} not found` });
		return res.json(book);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

router.put("/books/:id", async (req, res) => {
	try {
		const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!updatedBook) return res.status(404).json({ message: `Book ${req.params.id} not found` });
		return res.json(updatedBook);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
});

router.delete("/books/:id", async (req, res) => {
	try {
		const deletedBook = await Book.findByIdAndDelete(req.params.id);
		if (!deletedBook) return res.status(404).json({ message: `Book ${req.params.id} not found` });
		return res.json({ message: `Book ${req.params.id} deleted successfully` });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Book Service is running on port ${port}`);
});
