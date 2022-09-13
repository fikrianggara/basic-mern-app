const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

//@desc Get all users
//@route GET /user
//@access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "no users found" });
  }
  res.json(users);
});

//@desc Create new users
//@route POST /user
//@access Private
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "user ID is required" });
  }

  const users = await User.findById(id).select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "no users found" });
  }
  res.json(users);
});

//@desc Create new users
//@route POST /user
//@access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  //validate body
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required" });
  }
  //check duplicates
  const duplicate = await User.find({ username }).lean().exec();
  if (duplicate?.length) {
    return res.status(409).json({ message: "duplicate username" });
  }
  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const userData = {
    username,
    password: hashedPassword,
    roles,
  };

  const newUser = await User.create(userData);
  if (newUser) {
    return res.status(201).json({ message: `new user ${newUser.username}` });
  } else {
    return res.json({ message: "user fail to created" });
  }
});

//@desc Update users
//@route PATCH /user
//@access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  //validate data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "all fields are required" });
  }
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }

  //check duplicate
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "duplicate username" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    // hash password
    user.password = await bcrypt.hash(password, 10);
  }
  const updatedUser = await user.save();
  res.json({ message: `${updatedUser.username} updated` });
});

//@desc Delete users
//@route DELETE /user
//@access Private
const DeleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "user ID is required" });
  }
  const notes = await Note.findOne({ user: id }).lean().exec();
  if (notes) {
    return res.status(400).json({ message: "user must assigned notes" });
  }
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }
  const result = await user.deleteOne();
  res.json({ message: `${result.username} with id: ${result._id} deleted` });
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  DeleteUser,
  getUserById,
};
