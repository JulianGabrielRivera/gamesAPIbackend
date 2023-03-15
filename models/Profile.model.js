const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  profile_image: {
    type: String,
    default: 'https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg'
  },
  bio: {
    type: String,
    default: ''
  },
  age: Number,
  favorite_games: [],
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;