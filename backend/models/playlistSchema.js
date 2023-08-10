const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required"],
  },
  share: { type: String, enum: ["public", "private"], default: "private" },
  movies: [
    {
      movieId: { type: String },
      title: { type: String },
      year: { type: String },
      type: { type: String },
      poster: { type: String },
    },
  ],
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please login to create playlist"],
  },
});

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;
