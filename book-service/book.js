import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
	isbn: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	author: {
		type: String,
		required: true,
	},
	publishedDate: {
		type: Date,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	stock: {
		type: Number,
		default: 0, // Optional: Stock available
	},
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
