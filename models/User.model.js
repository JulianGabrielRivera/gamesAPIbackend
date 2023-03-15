const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: String,
    profile_image: {
      type: String,
      default:
        "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg",
    },
    bio: {
      type: String,
      default: "",
    },
    age: Number,

    games_pick: [{ type: Schema.Types.ObjectId, ref: "Games" }],
    // profile: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
