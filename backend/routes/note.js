const express = require("express");
const router = express.Router();

router.use(express.json());

// homepage, get into this route if '/', '/index' or '/index.html'
router.get("^/$|index(.html)", (req, res) => {
  res.send("from /notes");
});

// getting books by id
router.get("/:id", (req, res) => {
  const params = req.params;
  res.send(`note with id ${params.id}`);
});
router.post("/", (req, res) => {
  const body = req.body;
  res.json({ ...body });
});
router.all("*", (req, res) => {
  res.json({ message: "not found" });
});
module.exports = router;
