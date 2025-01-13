const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ValidationError = require("../utils/errors/ValidationError");
const NotFoundError = require("../utils/errors/NotFoundError");
const AuthError = require("../utils/errors/AuthError");
const DuplicateError = require("../utils/errors/DuplicateError");
const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError("User not found"))
    .then((user) => res.send(user))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email, avatar, password } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email, avatar, password },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => new NotFoundError("User not found"))
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new ValidationError("Invalid data provided"));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError("Email and password are required");
  }

  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword }),
    )
    .then((user) => {
      res.send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new DuplicateError("Email already exists"));
      } else if (err.name === "ValidationError") {
        next(new ValidationError(err.message));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError("Email and password are required");
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      next(new AuthError("Invalid email or password"));
    });
};

module.exports = { getCurrentUser, createUser, updateUser, login };
