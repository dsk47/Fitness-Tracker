const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { signToken } = require("../utils/jwt");
const ErrorResponse = require("../utils/errorResponse");
const { requireFields } = require("../utils/validate");

exports.register = async (req, res, next) => {
  try {
    requireFields(req.body, ["name", "email", "password"]);
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) throw new ErrorResponse("Email already registered", 400);

    const hash = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, passwordHash: hash });
    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    requireFields(req.body, ["email", "password"]);
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new ErrorResponse("Invalid credentials", 401);

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new ErrorResponse("Invalid credentials", 401);

    const token = signToken({ id: user._id });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};
