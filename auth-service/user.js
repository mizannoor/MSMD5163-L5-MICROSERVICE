import mongoose from "mongoose";
import bcrypt from "bcrypt-node";

const UserModel = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, minLength: 6 },
});

UserModel.pre("save", function (callback) {
	const user = this;
	if (!user.isModified("password")) return callback();

	bcrypt.genSalt(5, (err, salt) => {
		if (err) return callback(err);

		bcrypt.hash(user.password, salt, null, (err, hash) => {
			if (err) return callback(err);
			user.password = hash;
			callback();
		});
	});
});

UserModel.methods.verifyPassword = function (password, callback) {
	bcrypt.compare(password, this.password, (err, isMatch) => {
		if (err) return callback(err);
		callback(null, isMatch);
	});
};

export default mongoose.model("User", UserModel);
