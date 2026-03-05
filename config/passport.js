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

        const email = profile.emails[0].value;

        let user = await User.findOne({ email });
if (!user) {
  user = await User.create({
    name: profile.displayName,
    email: email,
    googleId: profile.id,
    role: "user" // Add this default
  });
}

        return done(null, user);

      } catch (err) {
        console.log(err);
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await require("../models/User").findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;