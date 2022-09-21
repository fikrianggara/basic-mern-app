const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);
const notesController = require("../controllers/note");

router.use(express.json());
router
  .route("/")
  .get(notesController.getAllNotes)
  .post(notesController.createNewNote)
  .patch(notesController.updateNote)
  .delete(notesController.deleteNote);

module.exports = router;
