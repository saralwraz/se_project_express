const User = require("../models/user");
const { err500, err404, err400, err409 } = require("../utils/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

// GET /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      res.status(err500.status).send({ message: err500.message });
    });
};

// GET /users/me
const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => new Error("NotFound"))
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.message === "NotFound") {
        return res.status(err404.status).send({ message: err404.message });
      }
      if (err.name === "CastError") {
        return res.status(err400.status).send({ message: err400.message });
      }
      res.status(err500.status).send({ message: err500.message });
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
    .then(() => res.send({ name, avatar }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(err404.status).send({ message: err404.message });
      }
      if (err.name === "ValidationError") {
        return res.status(err400.status).send({ message: err400.message });
      }
      res.status(err500.status).send({ message: err500.message });
    });
};

// POST /users - create new user
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  // Validate inputs
  if (!name || name.length < 2 || name.length > 30) {
    return res
      .status(err400.status)
      .send({ message: err400.message || "Invalid name length." });
  }
  if (!/^https?:\/\/\S+/.test(avatar)) {
    return res
      .status(err400.status)
      .send({ message: err400.message || "Invalid avatar URL." });
  }

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return Promise.reject(new Error("UserExists"));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      res
        .status(201)
        .send({ name: user.name, avatar: user.avatar, email: user.email });
    })
    .catch((err) => {
      console.error(err);

      if (err.message === "UserExists" || err.code === 11000) {
        return res
          .status(err400.status)
          .send({ message: "User with this email already exists." });
      }
      if (err.name === "ValidationError") {
        return res
          .status(err400.status)
          .send({ message: err400.message || err.message });
      }
      res.status(err500.status).send({ message: err500.message });
    });
};

// POST /login
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(err400.status)
      .send({ message: "Email and password are required" });
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message.includes("Incorrect")) {
        return res
          .status(err400.status)
          .send({ message: "Invalid email or password" });
      }
      res.status(err500.status).send({ message: err500.message });
    });
};

module.exports = { getUsers, getCurrentUser, createUser, updateUser, login };
