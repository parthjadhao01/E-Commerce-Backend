import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/UserModel.js";
import Role from "../models/RoleModel.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL || "/api/user/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          let userRole = await Role.findOne({ name: "user" });
          if (!userRole) {
            userRole = await Role.create({ name: "user", displayName: "User" });
          }
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            roles: [userRole._id],
            isEmailVerified: true,
            provider: "google",
            googleId: profile.id,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
