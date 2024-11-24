const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const {
  INVALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  AUTHORIZATION_ERROR,
  DEFAULT_ERROR,
  CONFLICT_ERROR,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

// GET /users/me
const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => new Error("NotFound"))
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.message === "NotFound") {
        return res.status(NOT_FOUND_ERROR).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(INVALID_DATA_ERROR)
          .send({ message: "Invalid data provided" });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "Internal Server Error" });
    });
};

// PATCH update users/me
const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then(() => res.status(200).send({ name, avatar }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA_ERROR).send({ message: "Bad Request" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: "Page Not Found" });
      }

      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// POST /users - create new user
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(INVALID_DATA_ERROR)
      .send({ message: "Email and password are required" });
  }

  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword }),
    )
    .then((user) => {
      // Successful user creation
      res.send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      // Handle errors
      console.error("Error code:", err.code);

      if (err.code === 11000) {
        // Duplicate email error
        return res
          .status(CONFLICT_ERROR)
          .send({ message: "Email already exists" });
      }

      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA_ERROR).send({ message: err.message });
      }

      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

// POST /login
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(INVALID_DATA_ERROR)
      .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (
        err.message.includes("Incorrect email") ||
        err.message.includes("Incorrect password")
      ) {
        return res
          .status(AUTHORIZATION_ERROR)
          .send({ message: "Invalid email or password" });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "Internal Server Error" });
    });
};

module.exports = { getCurrentUser, createUser, updateUser, login };
