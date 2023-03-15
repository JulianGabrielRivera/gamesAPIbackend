var express = require("express");
var router = express.Router();

const User = require("../models/User.model");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const isAuthenticated = require("../middleware/isAuthenticated");

router.post("/signup", (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "please fill out all fields" });
  }

  User.findOne({ email: req.body.email })
    .then((foundUser) => {
      if (foundUser) {
        return res.status(400).json({ message: "You've already registered" });
      } else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPass = bcrypt.hashSync(req.body.password, salt);

        User.create({
          password: hashedPass,
          email: req.body.email,
          name: req.body.name,
        })
          .then((createdUser) => {
            const payload = {
              _id: createdUser._id,
              email: createdUser.email,
              name: createdUser.name,
            };

            const token = jwt.sign(payload, process.env.SECRET, {
              algorithm: "HS256",
              expiresIn: "24hr",
            });
            res.json({
              token: token,
              _id: createdUser._id,
              message: `Welcome ${createdUser.name}`,
            });
          })
          .catch((err) => {
            res.status(400).json(err.message);
          });
      }
    })
    .catch((err) => {
      res.status(400).json(err.message);
    });
});

router.post("/login", (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "please fill out both fields" });
  }

  User.findOne({ email: req.body.email })
    .then((foundUser) => {
      if (!foundUser) {
        return res
          .status(401)
          .json({ message: "Email or Password is incorrect!!!" });
      }

      const doesMatch = bcrypt.compareSync(
        req.body.password,
        foundUser.password
      );

      if (doesMatch) {
        const payload = {
          _id: foundUser._id,
          email: foundUser.email,
          name: foundUser.name,
          profile_image: foundUser.profile_image,
          city: foundUser.city,
          age: foundUser.age,
          countries_visited: foundUser.countries_visited,
          posts: foundUser.posts,
        };

        const token = jwt.sign(payload, process.env.SECRET, {
          algorithm: "HS256",
          expiresIn: "24hr",
        });
        res.json({
          _id: foundUser._id,
          token: token,
          message: `Welcome ${foundUser.name}`,
        });
      } else {
        return res
          .status(402)
          .json({ message: "Email or Password is incorrect" });
      }
    })
    .catch((err) => {
      res.json(err.message);
    });
});

router.get("/verify", isAuthenticated, (req, res) => {
  User.findOne({ _id: req.user._id })

    .populate({ path: "games_pick", populate: { path: "review" } })
    /*.populate('countries_visited')*/
    /*.populate('posts')*/
    .then((foundUser) => {
      console.log(foundUser);
      const payload = { ...foundUser };
      delete payload._doc.password;

      res.status(200).json(payload._doc);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
