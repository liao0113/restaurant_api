const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passportJwt = require("passport-jwt");
const ExtractJwt = passportJwt.ExtractJwt;
const JwtStrategy = passportJwt.Strategy;
const db = require("../models");
const User = db.User;
const Restaurant = db.Restaurant;

//serialize and deserialize user

passport.serializeUser((user, done) => {
  console.log("serializing user !");
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log("deserializing user !");
  User.findByPk(id, {
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
      usernameField: "mail",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, mail, password, done) => {
      User.findOne({ where: { mail } })
        .then((user) => {
          if (!user)
            return done(
              null,
              false,
              req.flash("error_messages", "帳號或密碼輸入錯誤")
            );
          bcrypt.compare(password, user.password, function (err, result) {
            if (err) return done(null, false);
            if (!result) return done(null, false);
            else return done(null, user);
          });
        })
        .catch((err) => done(null, false));
    }
  )
);

//JWT
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = `${process.env.JWT_SECRET}`;

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

module.exports = passport;
