const jwt = require("jsonwebtoken");

const isAuthenticatedUser = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (!bearerHeader) {
      return res
        .status(401)
        .json({ message: "Please login to access this resource" });
    }

    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    if (!bearerToken) {
      return res
        .status(401)
        .json({ message: "Please login to access this resource" });
    }

    const { user } = jwt.verify(bearerToken, process.env.SECRET);
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { isAuthenticatedUser };
