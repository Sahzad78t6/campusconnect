const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://campusconnect-bcqq.onrender.com/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {

        let user = await User.findOne({ googleId: profile.id });

        // If user already exists
        if (user) {
          return done(null, user);
        }

        // Check if email already registered
        const existingUser = await User.findOne({
          email: profile.emails[0].value
        });

        if (existingUser) {
          existingUser.googleId = profile.id;
          await existingUser.save();
          return done(null, existingUser);
        }

        // Register new user
        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          password: "google-oauth"
        });

        done(null, newUser);

      } catch (err) {
        console.log(err);
        done(err, null);
      }
    }
  )
);

module.exports = passport;