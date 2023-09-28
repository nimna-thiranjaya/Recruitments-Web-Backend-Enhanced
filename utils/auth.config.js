// passport-config.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user/user.model");
// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const { name, emails, photos, displayName } = profile;

      const user = await User.findOne({ email: emails[0].value });

      if (!user) {
        const newUser = new User({
          googleId: profile.id,
          firstName: name.givenName,
          lastName: name.familyName,
          fullName: displayName,
          email: emails[0].value,
          imageUrl: photos[0].value,
          verified: true,
          role: "User",
        });

        await newUser
          .save()
          .then((user) => {
            return done(null, user);
          })
          .catch((err) => {
            return done(err);
          });
      } else {
        return done(null, user);
      }
    }
  )
);

// Configure Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: "YOUR_FACEBOOK_APP_ID",
      clientSecret: "YOUR_FACEBOOK_APP_SECRET",
      callbackURL: "/auth/facebook/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Add your logic to handle Facebook authentication here
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
