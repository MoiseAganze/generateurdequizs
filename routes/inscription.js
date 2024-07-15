const express = require("express");
const router = express.Router();
const User = require("../models/user");

var user = {};
// Exemple d'utilisation de Passport.js (un middleware pour l'authentification)
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Configuration de la stratégie Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "905274168597-tol6aaeie1jsqir2in95p08oputt98a5.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/auth/google/callback", // URL de rappel après l'authentification
    },
    (accessToken, refreshToken, profile, done) => {
      // profile contient les informations de l'utilisateur (e-mail, nom, etc.)
      // Enregistrez ces informations dans votre base de données MongoDB ici
      // (par exemple, créez un nouveau document utilisateur avec Mongoose)
      user = {
        email: profile.emails[0].value,
        name: profile.displayName,
        photo: profile.photos[0].value,
        // Stockez le hachage du mot de passe ici (si nécessaire)
      };

      // Enregistrez l'utilisateur dans MongoDB
      // ...
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  // Stockez l'ID de l'utilisateur dans la session
  done(null, user.email); // Utilisez un identifiant unique (par exemple, l'e-mail)
});

// Désérialisation de l'utilisateur
passport.deserializeUser((email, done) => {
  // Récupérez l'utilisateur à partir de l'ID (par exemple, l'e-mail)
  // Utilisez votre base de données MongoDB ici pour rechercher l'utilisateur
  // (par exemple, recherchez l'utilisateur par e-mail)
  const userFromDB = {
    email: email,
    // Autres informations de l'utilisateur (nom, etc.)
  };
  done(null, userFromDB);
});

// Route de connexion via Google
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback après l'authentification Google
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/compte" }),

  async (req, res) => {
    const email = user.email;
    const existUser = await User.findOne({ email: email });

    if (existUser) {
      req.session.connect = user;
    } else {
      const userdb = new User({ name: user.name, email: user.email });
      const authToken = await userdb.generateAuthTokenAndsaveuser();
      req.session.connect = user;
    }
    const link =
      req.cookies.lienredirect == undefined ? "/" : req.cookies.lienredirect;
    res.redirect(link);
  }
);

module.exports = router;
