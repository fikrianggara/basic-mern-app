const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

//@desc Get all notes
//@route GET /note
//@access public
const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().lean().exec();
  if (!notes?.length) {
    return res.status(400).json({ message: "no note found" });
  }
  res.json(notes);
});

//@desc Create a note
//@route POST /note
//@access public
const createNewNote = asyncHandler(async (req, res) => {
  const { userId, title, text } = req.body;
  //validate data
  console.log(req.body);
  if (!userId || !title || !text) {
    return res.status(400).json({ message: "All fields are required" });
  }
  //validate userId
  const user = await User.findById(userId).lean().exec();
  console.log(user);
  if (!user) {
    return res
      .status(400)
      .json({ message: "user not found, user is required to do the action" });
  }
  const noteData = {
    user,
    title,
    text,
  };
  const newNote = await Note.create(noteData);

  if (newNote) {
    return res.json(newNote);
  } else {
    return res.status({ message: "note fails to created" });
  }
});

//@desc Update a note
//@route PATCH /note
//@access public
const updateNote = asyncHandler(async (req, res) => {});

//@desc Delete a note
//@route DELETE /note
//@access public
const deleteNote = asyncHandler(async (req, res) => {});

module.exports = { getAllNotes, createNewNote, updateNote, deleteNote };
