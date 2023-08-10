const { default: axios } = require("axios");

const searchMovie = async (req, res) => {
  try {
    const { search } = req.query;
    const { data } = await axios.get(
      `https://www.omdbapi.com/?s=${search}&apikey=${process.env.API_KEY}`
    );

    res.status(200).json({ data });
  } catch (error) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};

module.exports = { searchMovie };
