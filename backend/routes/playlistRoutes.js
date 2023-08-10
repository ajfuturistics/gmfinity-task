const express = require("express");
const {
  addToPlaylist,
  createPlaylist,
  updatePlaylist,
  getPlaylist,
  getMyPlaylists,
  deletePlaylist,
} = require("../controllers/playlistController");
const { isAuthenticatedUser } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticatedUser, getMyPlaylists)
  .post(isAuthenticatedUser, createPlaylist);

router
  .route("/:id")
  .get(getPlaylist)
  .post(isAuthenticatedUser, addToPlaylist)
  .put(isAuthenticatedUser, updatePlaylist)
  .delete(isAuthenticatedUser, deletePlaylist);

module.exports = router;
