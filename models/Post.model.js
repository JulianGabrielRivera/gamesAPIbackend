const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    title: String,
    story: String,
    date: Date,
    photo: String,
    contributor: {type: Schema.Types.ObjectId, ref: 'User'},
    country: {type: Schema.Types.ObjectId, ref: 'Country'}
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const Post = model("Post", postSchema);

module.exports = Post;

