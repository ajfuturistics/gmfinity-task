const jwt = require("jsonwebtoken");

const getAuthUser = (req) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    return null;
  }

  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];

  if (!bearerToken) {
    return null;
  }

  const { user } = jwt.verify(bearerToken, process.env.SECRET);
  return user;
};

module.exports = { getAuthUser };
