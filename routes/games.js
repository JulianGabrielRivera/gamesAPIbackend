var express = require("express");
var router = express.Router();

const User = require("../models/User.model");
const Review = require("../models/Review.model");
const Games = require("../models/Games.model");
const isAuthenticated = require("../middleware/isAuthenticated");
// games_pick

router.post("/add-wish/:userId", (req, res, next) => {
  console.log(req.body);
  function objectId() {
    const os = require("os");
    const crypto = require("crypto");

    const secondInHex = Math.floor(new Date() / 1000).toString(16);
    const machineId = crypto
      .createHash("md5")
      .update(os.hostname())
      .digest("hex")
      .slice(0, 6);
    const processId = process.pid.toString(16).slice(0, 4).padStart(4, "0");
    const counter = process
      .hrtime()[1]
      .toString(16)
      .slice(0, 6)
      .padStart(6, "0");

    return secondInHex + machineId + processId + counter;
  }
  console.log(objectId());
  Games.findOne({ name: req.body.game.name }).then((foundGame) => {
    if (!foundGame) {
      Games.create({
        name: req.body.game.name,
        id: req.body.game.id,
        background_image: req.body.game.background_image,
        released: req.body.game.released,
        review: objectId(),
        // review: mongoId,
        // genres: Array,
        // platforms: [Object],
        // languages: [String],
        metacritic: req.body.game.metacritic,
      }).then((gameCreated) => {
        User.findByIdAndUpdate(
          req.params.userId,
          {
            $addToSet: { games_pick: gameCreated._id },
          },
          { new: true }
        )
          .populate("games_pick")
          .then((updatedUser) => {
            res.json(updatedUser);
          });
      });
    } else {
      Games.findOne({ name: req.body.game.name }).then((foundGame) => {
        User.findByIdAndUpdate(
          req.params.userId,
          {
            $addToSet: { games_pick: foundGame._id },
          },
          { new: true }
        )
          .populate("games_pick")
          .then((updatedUser) => {
            res.json(updatedUser);
          });
      });
    }
  });

  // User.findByIdAndUpdate(
  //   req.params.userId,
  //   {
  //     $addToSet: { games_pick: req.body.game },
  //   },
  //   { new: true }
  // )
  //   .then((updatedUser) => {
  //     return updatedUser.populate("games_pick");
  //   })

  //   // .then((populated) => {
  //   //     return populated.populate('posts')
  //   // })
  //   .then((second) => {
  //     res.json(second);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
});

router.post("/delete/add-wish/:userId", (req, res, next) => {
  const gameId = req.body.gameId;
  if (typeof gameId !== "number") {
    res.status(400).json({ message: "Invalid game ID" });
    return;
  }
  User.findById(req.params.userId)
    .populate("games_pick")
    .then((foundUser) => {
      if (foundUser.games_pick.some((game) => game.id === gameId)) {
        const updatedGames = foundUser.games_pick.filter(
          (game) => game.id !== gameId
        );
        foundUser.games_pick = updatedGames;
        foundUser
          .save()
          .then((savedUser) => {
            res.json(savedUser);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "server" });
          });
      } else {
        res.json({ message: "Game not found in wishlist" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "server error" });
    });
});

router.post("/reviews/:id", isAuthenticated, (req, res, next) => {
  console.log(req.body);
  Review.create({
    comment: req.body.comment,
    gameId: req.params.id,
  }).then((createdReview) => {
    console.log(createdReview);
    res.json(createdReview);
  });
});

router.get("/reviews/find", async (req, res, next) => {
  const foundRevs = await Review.find();

  console.log(foundRevs);
  res.json(foundRevs);
});

router.get("/reviews/:gameId/:userId", isAuthenticated, (req, res) => {
  console.log(req.params.gameId);
  console.log(req.body);

  Games.findOne({ id: req.params.gameId }).then((foundGame) => {
    // if (!foundGame.reviews.length)
    console.log(foundGame);
    Review.findByIdAndDelete(foundGame.review).then((deletedUser) => {
      console.log(deletedUser);
      Games.findOneAndUpdate(
        { id: req.params.gameId },
        { isCommented: false },
        { new: true }
      ).then((updatedGame) => {
        console.log(updatedGame);
        User.findById(req.params.userId)
          .populate({ path: "games_pick", populate: { path: "review" } })
          .then((foundUser) => {
            res.json(foundUser);
          });
      });
    });
    // Games.findByIdAndDelete(
    //   req.params.id,

    //   { review: createdReview._id, isCommented: true },

    //   { new: true }
    // ).then((updatedGame) => {
    //   console.log(updatedGame);
    // });

    // User.findById(req.params.userId)

    //   .populate({ path: "games_pick", populate: { path: "review" } })
    //   .then((updatedUser) => {
    //     console.log(updatedUser);
    //     res.json(updatedUser);
    //   });
  });
});

// Create a new review instance using the Review model

module.exports = router;
