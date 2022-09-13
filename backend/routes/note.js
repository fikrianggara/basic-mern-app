const express = require("express");
const router = express.Router();
const notesController = require("../controllers/note");

router.use(express.json());
router
  .route("/")
  .get(notesController.getAllNotes)
  .post(notesController.createNewNote);
//   .patch(notesController.updateUser)
//   .delete(notesController.DeleteUser);

module.exports = router;
