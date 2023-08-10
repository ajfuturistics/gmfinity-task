const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ user }, process.env.SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ user, token });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existing = await User.findOne({ username });

    if (existing) {
      return res
        .status(400)
        .json({ message: "User already exists try logging in" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      password: hashedPass,
    });

    const token = jwt.sign({ user }, process.env.SECRET);

    res.status(201).json({ user, token, message: "user created successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};

module.exports = { getUser, createUser };
