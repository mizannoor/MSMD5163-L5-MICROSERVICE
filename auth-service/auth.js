import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import User from "./user.js";
import config from "./config.js";

const params = {
	secretOrKey: config.secret,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

export default function () {
	const strategy = new JwtStrategy(params, async (payload, done) => {
		try {
			const user = await User.findOne({ id: payload.id });
			if (user) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		} catch (err) {
			return done(err, false);
		}
	});

	passport.use(strategy);

	return {
		initialize: () => passport.initialize(),
		authenticate: () => passport.authenticate("jwt", { session: false }),
	};
}
