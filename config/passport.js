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

        const email = profile.emails?.[0]?.value;

        let user = await User.findOne({ email });

        if (!user) {
          user = new User({
            name: profile.displayName,
            email: email,
            googleId: profile.id,
            password: "google-oauth",
            role: "user"
          });

          await user.save();
        }

        done(null, user);

      } catch (err) {
        console.log("Google Auth Error:", err);
        done(err, null);
      }
    }
  )
);
module.exports = passport;