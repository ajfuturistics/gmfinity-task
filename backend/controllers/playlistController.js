const Playlist = require("../models/playlistSchema");
const { getAuthUser } = require("../utils/getAuthUser");

const getPlaylist = async (req, res) => {
  try {
    const user = await getAuthUser(req);
    const playlist = await Playlist.findById(req.params.id).populate({
      path: "userId",
      select: "username _id",
    });

    if (!playlist) {
      return res
        .status(404)
        .json({ message: "No playlist found with this id" });
    }

    if (playlist.share === "private" && !user) {
      return res
        .status(401)
        .json({ message: "Please login to access this resource" });
    }

    res.status(200).json({ playlist });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getMyPlaylists = async (req, res) => {
  try {
    const user = req.user;
    const playlists = await Playlist.find({ userId: user?._id }).populate({
      path: "userId",
      select: "username _id",
    });

    res.status(200).json({ playlists });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const createPlaylist = async (req, res) => {
  try {
    const { title, share, movies } = req.body;
    const user = req.user;

    const playlist = await Playlist.create({
      title,
      share,
      movies,
      userId: user?._id,
    });

    res
      .status(201)
      .json({ message: "Playlist created successfully", playlist });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const addToPlaylist = async (req, res) => {
  try {
    const { movie } = req.body;
    const user = req.user;

    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res
        .status(404)
        .json({ message: "No playlist found with this id" });
    }

    if (playlist.userId.toString() !== user?._id) {
      return res
        .status(401)
        .json({ message: "You are not allowed to add movies to playlist" });
    }

    const isMovieExists = await playlist.movies.find(
      (item) => item.movieId === movie.movieId
    );

    if (isMovieExists) {
      return res
        .status(400)
        .json({ message: "Movie already added in playlist" });
    }

    playlist.movies.push(movie);
    await playlist.save();

    res
      .status(200)
      .json({ message: "Movie added to playlist successfully", playlist });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updatePlaylist = async (req, res) => {
  try {
    const { title, share } = req.body;
    const user = req.user;

    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res
        .status(404)
        .json({ message: "No playlist found with this id" });
    }

    if (playlist.userId.toString() !== user?._id) {
      return res
        .status(401)
        .json({ message: "You are not allowed to update this playlist" });
    }

    await Playlist.findByIdAndUpdate(req.params.id, {
      title,
      share,
    });

    res.status(200).json({ message: "Playlist updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const user = req.user;

    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res
        .status(404)
        .json({ message: "No playlist found with this id" });
    }

    if (playlist.userId.toString() !== user?._id) {
      return res
        .status(401)
        .json({ message: "You are not allowed to update this playlist" });
    }

    await playlist.deleteOne();

    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
module.exports = {
  addToPlaylist,
  createPlaylist,
  updatePlaylist,
  getPlaylist,
  getMyPlaylists,
  deletePlaylist,
};
