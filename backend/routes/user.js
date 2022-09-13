const express = require("express");
const router = express.Router();
const usersController = require("../controllers/user");

router.use(express.json());
router
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.DeleteUser);

// // homepage, get into this route if '/', '/index' or '/index.html'
// router.get("^/$|index(.html)", (req, res) => {
//   res.send("from /users");
// });
// // define the about route
// router.get("/about", (req, res) => {
//   res.send("About birds");
// });

// // getting books by id
// router.get("/:id", (req, res) => {
//   const params = req.params;
//   res.send(`user with id ${params.id}`);
// });

// //create user
// router.post("/", (req, res) => {

//   res.json(newUser);
// });
// router.all("*", (req, res) => {
//   res.json({ message: "not found" });
// });
module.exports = router;
