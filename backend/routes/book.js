const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);
const router = express.Router();

router.use(express.json());

// homepage, get into this route if '/', '/index' or '/index.html'
router.get("/", (req, res) => {
  res.send("from /books");
});
router.get("^/$|index(.html)", (req, res) => {
  res.send("Birds home page");
});
// define the about route
router.get("/about", (req, res) => {
  res.send("About birds");
});

// getting books by id
router.get("/:id", (req, res) => {
  const params = req.params;
  res.json({ ...params });
});
router.post("/", (req, res) => {
  const body = req.body;
  res.json({ ...body });
});
router.all("*", (req, res) => {
  res.json({ message: "not found" });
});
module.exports = router;
