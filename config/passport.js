const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passportJwt = require("passport-jwt");
const ExtractJwt = passportJwt.ExtractJwt;
const JwtStrategy = passportJwt.Strategy;
const User = require("../models/user");
const Restaurant = require("../models/restaurant");

//serialize and deserialize user

passport.serializeUser((user, done) => {
  console.log("serializing user !");
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log("deserializing user !");
  User.findbyPk(id, {
    include: [
      { model: Restaurant, as: "FavoritedRestaurants" },
      { model: Restaurant, as: "LikedRestaurants" },
      { model: User, as: "Followers" },
      { model: User, as: "Followings" },
    ],
  })
    .then((user) => {
      user = user.toJSON();
      return done(null, user);
    })
    .catch((err) => {
      console.log(err);
    });
});
//local-passport
passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      User.findOne({ where: { email } }).then((user) => {
        if (!user)
          return done(
            null,
            false,
            req.flash("error_messages", "帳號或密碼輸入錯誤")
          );
        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch)
          return done(
            null,
            false,
            req.flash("error_messages", "帳號或密碼輸入錯誤!")
          );
        return done(null, user);
      });
    }
  )
);

//JWT
const jwtOptions = {};
jwtOptions.jwtFromResquest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new JwtStrategy(jwtOptions, function (jwt_payload, done) {
    User.findbyPk(jwt_payload.id, {
      include: [
        { model: Restaurant, as: "FavoritedRestaurants" },
        { model: Restaurant, as: "LikedRestaurants" },
        { model: User, as: "Followers" },
        { model: User, as: "Followings" },
      ],
    })
      .then((user) => {
        if (!user) return done(null, false);
        return done(null, user);
      })
      .catch((err) => {
        console.log(err);
      });
  })
);
