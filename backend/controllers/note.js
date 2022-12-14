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
  //notes with user
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );
  res.json(notesWithUser);
});

//@desc Create a note
//@route POST /note
//@access public
const createNewNote = asyncHandler(async (req, res) => {
  const { userId, title, text } = req.body;
  //validate data
  if (!userId || !title || !text) {
    return res.status(400).json({ message: "All fields are required" });
  }
  //validate userId
  const user = await User.findById(userId).lean().exec();
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
const updateNote = asyncHandler(async (req, res) => {
  const { userId, id, title, text, completed } = req.body;
  //validate data
  if (!userId || !title || !text || typeof completed !== "boolean") {
    console.log(typeof completed);
    return res.status(400).json({ message: "All fields are required" });
  }
  //validate userId
  const user = await User.findById(userId).lean().exec();
  if (!user) {
    return res
      .status(400)
      .json({ message: "user not found, user is required to do the action" });
  }
  console.log("user", user);
  // check note availability
  const note = await Note.findById(id).exec();
  if (!note) {
    return res.status(404).json({ message: "note not found" });
  }
  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;
  const updatedNote = await note.save();
  res.json({ message: `note with title ${updatedNote.title} updated` });
});

//@desc Delete a note
//@route DELETE /note
//@access public
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ mesage: "All fileds are required" });
  }
  const note = await Note.findById(id).exec();
  if (!note) {
    return res.status(404).json({ message: "note not found" });
  }
  const deletedNote = await note.deleteOne();
  res.json({ message: `note with id: ${deletedNote._id.toString()} deleted` });
});

module.exports = { getAllNotes, createNewNote, updateNote, deleteNote };
