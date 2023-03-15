const { Schema, model } = require("mongoose");

const gamesSchema = new Schema(
  {
    name: String,
    id: Number,
    background_image: String,
    released: String,
    // genres: Array,
    // platforms: [Object],
    // languages: [String],
    isCommented: { type: Boolean, default: false },
    metacritic: Number,
    review: { type: Schema.Types.ObjectId, ref: "Review" },
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const Games = model("Games", gamesSchema);

module.exports = Games;
